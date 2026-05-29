export type DownloadType = 'video' | 'audio'
export type VideoFormat = 'mp4' | 'webm' | 'mkv'
export type VideoQuality = 'best' | '2160' | '1440' | '1080' | '720' | '480' | '360' | '240'
export type AudioFormat = 'mp3' | 'aac' | 'm4a' | 'flac' | 'wav' | 'ogg' | 'opus'
export type AudioQuality = 'best' | '320' | '256' | '192' | '128' | '96'
export type DownloadPhase = 'starting' | 'downloading' | 'audio' | 'merging' | 'complete' | 'error'

export interface DownloadOptions {
  type: DownloadType
  videoFormat: VideoFormat
  videoQuality: VideoQuality
  audioFormat: AudioFormat
  audioQuality: AudioQuality
  embedSubs: boolean
  embedThumbnail: boolean
  embedMetadata: boolean
}

export interface VideoInfo {
  id: string
  title: string
  thumbnail: string
  duration: number
  channel: string
  channelUrl?: string | null
  viewCount?: number | null
  likeCount?: number | null
  uploadDate?: string | null
  url: string
  isLive: boolean
  availableHeights: number[]
  hasSubtitles: boolean
}

export interface ProgressState {
  phase: DownloadPhase
  percent: number
  speed: string
  eta: string
  size: string
  filename: string
  error: string
}
