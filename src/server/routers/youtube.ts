import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '@/server/trpc'

const execFileAsync = promisify(execFile)
const YT_DLP = process.env.YT_DLP_BIN || '/opt/homebrew/bin/yt-dlp'

const YOUTUBE_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'm.youtube.com',
  'music.youtube.com',
]

function isYouTubeUrl(url: string): boolean {
  try {
    return YOUTUBE_HOSTS.includes(new URL(url).hostname)
  } catch {
    return false
  }
}

interface YtFormat {
  height?: number
  ext?: string
  vcodec: string
  acodec: string
}

interface YtRaw {
  id: string
  title: string
  thumbnail: string
  thumbnails?: { url: string; width?: number }[]
  duration: number
  channel?: string
  uploader?: string
  channel_url?: string
  view_count?: number
  like_count?: number
  upload_date?: string
  description?: string
  webpage_url: string
  formats: YtFormat[]
  is_live?: boolean
  live_status?: string
  subtitles?: Record<string, unknown[]>
  automatic_captions?: Record<string, unknown[]>
}

export const youtubeRouter = router({
  getInfo: publicProcedure.input(z.object({ url: z.string() })).query(async ({ input }) => {
    const url = input.url.trim()
    if (!isYouTubeUrl(url)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'URL non valido. Inserisci un link YouTube.',
      })
    }
    try {
      const envPath = `/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH ?? ''}`
      const { stdout } = await execFileAsync(
        YT_DLP,
        ['--dump-json', '--no-warnings', '--no-call-home', url],
        { maxBuffer: 20 * 1024 * 1024, env: { ...process.env, PATH: envPath } },
      )
      const r = JSON.parse(stdout) as YtRaw
      const videoFormats = r.formats.filter(
        (f) => f.vcodec !== 'none' && f.height && !['mhtml', 'sb'].includes(f.ext ?? ''),
      )
      const availableHeights = [...new Set(videoFormats.map((f) => f.height!))].sort(
        (a, b) => b - a,
      )
      const bestThumbnail =
        r.thumbnails?.filter((t) => t.url).sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]
          ?.url ?? r.thumbnail
      const hasSubs =
        Object.keys(r.subtitles ?? {}).filter((k) => k !== 'live_chat').length > 0 ||
        Object.keys(r.automatic_captions ?? {}).filter((k) => k !== 'live_chat').length > 0
      return {
        id: r.id,
        title: r.title,
        thumbnail: bestThumbnail,
        duration: r.duration || 0,
        channel: r.channel ?? r.uploader ?? 'Unknown',
        channelUrl: r.channel_url,
        viewCount: r.view_count,
        likeCount: r.like_count,
        uploadDate: r.upload_date,
        url: r.webpage_url,
        isLive: r.is_live ?? r.live_status === 'is_live',
        availableHeights,
        hasSubtitles: hasSubs,
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('unavailable') || msg.includes('Private')) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Video non disponibile o privato.' })
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "Impossibile ottenere le informazioni. Verifica l'URL.",
      })
    }
  }),
})
