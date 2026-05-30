import { ExternalLink, Eye, ThumbsUp } from 'lucide-react'
import type { VideoInfo } from '@/lib/schemas/downloader'
import { formatCount, formatUploadDate } from '@/lib/time'

type Props = Pick<
  VideoInfo,
  | 'title'
  | 'channel'
  | 'channelUrl'
  | 'viewCount'
  | 'likeCount'
  | 'uploadDate'
  | 'url'
  | 'availableHeights'
  | 'hasSubtitles'
>

export function VideoMeta({
  title,
  channel,
  channelUrl,
  viewCount,
  likeCount,
  uploadDate,
  url,
  availableHeights,
  hasSubtitles,
}: Props) {
  return (
    <div className="space-y-2 p-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-1"
      >
        <h2 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-yt-red transition-colors">
          {title}
        </h2>
        <ExternalLink className="mt-0.5 h-3 w-3 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {channel && (
          <a
            href={channelUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground/80 hover:text-yt-red transition-colors"
          >
            {channel}
          </a>
        )}
        {viewCount != null && (
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatCount(viewCount)}
          </span>
        )}
        {likeCount != null && (
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            {formatCount(likeCount)}
          </span>
        )}
        {uploadDate && <span>{formatUploadDate(uploadDate)}</span>}
      </div>

      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {availableHeights.slice(0, 6).map((h) => (
          <span
            key={h}
            className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {h >= 2160 ? '4K' : h >= 1440 ? '2K' : `${h}p`}
          </span>
        ))}
        {hasSubtitles && (
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            CC
          </span>
        )}
      </div>
    </div>
  )
}
