import type { DownloadOptions } from '@/schemas/downloader'

export const VIDEO_QUALITIES = [
  { label: 'Migliore', value: 'best' },
  { label: '4K', value: '2160' },
  { label: '2K', value: '1440' },
  { label: '1080p', value: '1080' },
  { label: '720p', value: '720' },
  { label: '480p', value: '480' },
  { label: '360p', value: '360' },
  { label: '240p', value: '240' },
] as const

export const VIDEO_FORMATS = [
  { label: 'MP4', value: 'mp4', sub: 'Compatibilità' },
  { label: 'WebM', value: 'webm', sub: 'Open source' },
  { label: 'MKV', value: 'mkv', sub: 'Qualità max' },
] as const

export const AUDIO_FORMATS = [
  { label: 'MP3', value: 'mp3', sub: 'Universale' },
  { label: 'AAC', value: 'aac', sub: 'Apple' },
  { label: 'M4A', value: 'm4a', sub: 'iTunes' },
  { label: 'FLAC', value: 'flac', sub: 'Lossless' },
  { label: 'WAV', value: 'wav', sub: 'Studio' },
  { label: 'OGG', value: 'ogg', sub: 'Open' },
  { label: 'OPUS', value: 'opus', sub: 'Streaming' },
] as const

export const AUDIO_QUALITIES = [
  { label: 'Migliore', value: 'best' },
  { label: '320 kbps', value: '320' },
  { label: '256 kbps', value: '256' },
  { label: '192 kbps', value: '192' },
  { label: '128 kbps', value: '128' },
  { label: '96 kbps', value: '96' },
] as const

export const DEFAULT_OPTIONS: DownloadOptions = {
  type: 'video',
  videoFormat: 'mp4',
  videoQuality: 'best',
  audioFormat: 'mp3',
  audioQuality: 'best',
  embedSubs: false,
  embedThumbnail: true,
  embedMetadata: true,
}

export function buildDownloadLabel(opts: DownloadOptions): string {
  if (opts.type === 'audio') {
    const q = opts.audioQuality === 'best' ? 'Migliore' : `${opts.audioQuality} kbps`
    return `${opts.audioFormat.toUpperCase()} · ${q}`
  }
  const q =
    opts.videoQuality === 'best'
      ? 'Migliore'
      : opts.videoQuality === '2160'
        ? '4K'
        : opts.videoQuality === '1440'
          ? '2K'
          : `${opts.videoQuality}p`
  return `${opts.videoFormat.toUpperCase()} · ${q}`
}
