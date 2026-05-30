import { z } from 'zod'

export const downloadTypeSchema = z.enum(['video', 'audio'])
export type DownloadType = z.infer<typeof downloadTypeSchema>

export const videoFormatSchema = z.enum(['mp4', 'webm', 'mkv'])
export type VideoFormat = z.infer<typeof videoFormatSchema>

export const videoQualitySchema = z.enum([
  'best',
  '2160',
  '1440',
  '1080',
  '720',
  '480',
  '360',
  '240',
])
export type VideoQuality = z.infer<typeof videoQualitySchema>

export const audioFormatSchema = z.enum(['mp3', 'aac', 'm4a', 'flac', 'wav', 'ogg', 'opus'])
export type AudioFormat = z.infer<typeof audioFormatSchema>

export const audioQualitySchema = z.enum(['best', '320', '256', '192', '128', '96'])
export type AudioQuality = z.infer<typeof audioQualitySchema>

export const downloadPhaseSchema = z.enum([
  'starting',
  'downloading',
  'audio',
  'merging',
  'complete',
  'error',
])
export type DownloadPhase = z.infer<typeof downloadPhaseSchema>

export const downloadOptionsSchema = z.object({
  type: downloadTypeSchema,
  videoFormat: videoFormatSchema,
  videoQuality: videoQualitySchema,
  audioFormat: audioFormatSchema,
  audioQuality: audioQualitySchema,
  embedSubs: z.boolean(),
  embedThumbnail: z.boolean(),
  embedMetadata: z.boolean(),
})
export type DownloadOptions = z.infer<typeof downloadOptionsSchema>

export const videoInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  duration: z.number(),
  channel: z.string(),
  channelUrl: z.string().nullable().optional(),
  viewCount: z.number().nullable().optional(),
  likeCount: z.number().nullable().optional(),
  uploadDate: z.string().nullable().optional(),
  url: z.string(),
  isLive: z.boolean(),
  availableHeights: z.array(z.number()),
  hasSubtitles: z.boolean(),
})
export type VideoInfo = z.infer<typeof videoInfoSchema>

export const progressStateSchema = z.object({
  phase: downloadPhaseSchema,
  percent: z.number(),
  speed: z.string(),
  eta: z.string(),
  size: z.string(),
  filename: z.string(),
  error: z.string(),
})
export type ProgressState = z.infer<typeof progressStateSchema>
