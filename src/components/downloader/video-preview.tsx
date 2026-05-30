import type { VideoInfo } from '@/schemas/downloader'
import { VideoMeta } from './video-meta'
import { VideoThumbnail } from './video-thumbnail'

interface VideoPreviewProps {
  info: VideoInfo
}

export function VideoPreview({ info }: VideoPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <VideoThumbnail
        src={info.thumbnail}
        alt={info.title}
        duration={info.duration}
        isLive={info.isLive}
      />
      <VideoMeta
        title={info.title}
        channel={info.channel}
        channelUrl={info.channelUrl}
        viewCount={info.viewCount}
        likeCount={info.likeCount}
        uploadDate={info.uploadDate}
        url={info.url}
        availableHeights={info.availableHeights}
        hasSubtitles={info.hasSubtitles}
      />
    </div>
  )
}
