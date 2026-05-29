import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { Readable } from 'node:stream'
import type { NextRequest } from 'next/server'

export const maxDuration = 120

const MIME: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  '.mp3': 'audio/mpeg',
  '.aac': 'audio/aac',
  '.m4a': 'audio/mp4',
  '.flac': 'audio/flac',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.opus': 'audio/opus',
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return new Response('ID non valido', { status: 400 })

  const tmpDir = path.join(os.tmpdir(), 'ytdl', id)
  try {
    const files = fs.readdirSync(tmpDir).filter((f) => !f.startsWith('.'))
    if (!files.length) return new Response('File non trovato', { status: 404 })

    const filename = files[0]
    const filepath = path.join(tmpDir, filename)
    const stat = fs.statSync(filepath)
    const mime = MIME[path.extname(filename).toLowerCase()] ?? 'application/octet-stream'

    const nodeStream = fs.createReadStream(filepath)
    nodeStream.on('close', () => fs.rm(tmpDir, { recursive: true }, () => {}))

    return new Response(Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>, {
      headers: {
        'Content-Type': mime,
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Content-Length': String(stat.size),
      },
    })
  } catch {
    return new Response('File non trovato o scaduto', { status: 404 })
  }
}
