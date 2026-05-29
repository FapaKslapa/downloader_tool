import { spawn } from 'node:child_process'
import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { buildFormatString } from '@/lib/yt-format'
import type { DownloadOptions } from '@/types/downloader'

export const maxDuration = 300

const YT_DLP = process.env.YT_DLP_BIN || '/opt/homebrew/bin/yt-dlp'
const FFMPEG_DIR = process.env.FFMPEG_BIN
  ? path.dirname(process.env.FFMPEG_BIN)
  : '/opt/homebrew/bin'

const schema = z.object({
  url: z.string(),
  type: z.enum(['video', 'audio']).default('video'),
  videoFormat: z.enum(['mp4', 'webm', 'mkv']).default('mp4'),
  videoQuality: z
    .enum(['best', '2160', '1440', '1080', '720', '480', '360', '240'])
    .default('best'),
  audioFormat: z.enum(['mp3', 'aac', 'm4a', 'flac', 'wav', 'ogg', 'opus']).default('mp3'),
  audioQuality: z.enum(['best', '320', '256', '192', '128', '96']).default('best'),
  embedSubs: z.string().optional(),
  embedThumbnail: z.string().optional(),
  embedMetadata: z.string().optional(),
})

function buildArgs(opts: z.infer<typeof schema>, outputPath: string): string[] {
  const o = opts as unknown as DownloadOptions
  const args = [
    opts.url,
    '-o',
    outputPath,
    '--no-warnings',
    '--no-call-home',
    '--ffmpeg-location',
    FFMPEG_DIR,
    '--newline',
    '--progress',
  ]
  if (opts.type === 'audio') {
    args.push('-x', '--audio-format', opts.audioFormat)
    if (opts.audioQuality !== 'best') args.push('--audio-quality', `${opts.audioQuality}K`)
  } else {
    args.push('-f', buildFormatString(o), '--merge-output-format', opts.videoFormat)
  }
  if (opts.embedSubs === 'true') args.push('--all-subs', '--embed-subs')
  if (opts.embedThumbnail === 'true') args.push('--embed-thumbnail')
  if (opts.embedMetadata === 'true') args.push('--add-metadata')
  return args
}

export async function GET(request: NextRequest) {
  const parsed = schema.safeParse(Object.fromEntries(request.nextUrl.searchParams))
  if (!parsed.success) return new Response('Parametri non validi', { status: 400 })

  const opts = parsed.data
  const id = crypto.randomUUID()
  const tmpDir = path.join(os.tmpdir(), 'ytdl', id)
  fs.mkdirSync(tmpDir, { recursive: true })

  const enc = new TextEncoder()
  const send = (d: object) => enc.encode(`data: ${JSON.stringify(d)}\n\n`)

  const stream = new ReadableStream({
    start(ctrl) {
      ctrl.enqueue(send({ type: 'start', id }))
      const envPath = `/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH ?? ''}`
      const proc = spawn(YT_DLP, buildArgs(opts, path.join(tmpDir, '%(title)s.%(ext)s')), {
        env: { ...process.env, PATH: envPath },
      })

      let phase = 0
      let errBuf = ''
      const onLine = (line: string) => {
        if (line.includes('[download] Destination:')) {
          phase++
          ctrl.enqueue(send({ type: 'phase', phase }))
          return
        }
        const m = line.match(
          /\[download\]\s+([\d.]+)%\s+of\s+(?:~?\s*)([\d.]+\s*\S+)\s+at\s+([\d.]+\s*\S+\/s)\s+ETA\s+(\S+)/,
        )
        if (m) {
          ctrl.enqueue(
            send({ type: 'progress', percent: +m[1], size: m[2], speed: m[3], eta: m[4], phase }),
          )
          return
        }
        if (line.includes('[Merger]') || line.includes('[ffmpeg]'))
          ctrl.enqueue(send({ type: 'merging' }))
        if (line.includes('ERROR:')) errBuf += `${line}\n`
      }
      proc.stdout.on('data', (c: Buffer) => c.toString().split('\n').forEach(onLine))
      proc.stderr.on('data', (c: Buffer) => c.toString().split('\n').forEach(onLine))
      proc.on('error', (e: Error) => {
        ctrl.enqueue(send({ type: 'error', message: e.message }))
        ctrl.close()
      })
      proc.on('close', (code: number | null) => {
        if (code !== 0) {
          ctrl.enqueue(
            send({ type: 'error', message: `Download fallito. ${errBuf.slice(0, 200)}` }),
          )
          fs.rm(tmpDir, { recursive: true }, () => {})
        } else {
          const files = fs.readdirSync(tmpDir).filter((f) => !f.startsWith('.'))
          if (!files.length) {
            ctrl.enqueue(send({ type: 'error', message: 'Nessun file trovato.' }))
          } else ctrl.enqueue(send({ type: 'complete', id, filename: files[0] }))
        }
        ctrl.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
