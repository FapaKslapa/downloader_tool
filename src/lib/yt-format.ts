import type { DownloadOptions } from '@/schemas/downloader'

export function buildFormatString(opts: DownloadOptions): string {
  if (opts.type === 'audio') return 'bestaudio/best'
  const q = opts.videoQuality === 'best' ? '' : `[height<=${opts.videoQuality}]`
  switch (opts.videoFormat) {
    case 'mp4':
      return `bestvideo${q}[ext=mp4]+bestaudio[ext=m4a]/bestvideo${q}+bestaudio/best${q}[ext=mp4]/best${q}`
    case 'webm':
      return `bestvideo${q}[ext=webm]+bestaudio[ext=webm]/bestvideo${q}+bestaudio/best${q}`
    default:
      return `bestvideo${q}+bestaudio/best${q}`
  }
}
