import { VideoMeta } from '@/components/downloader/video-meta'
import { VideoThumbnail } from '@/components/downloader/video-thumbnail'
import type { VideoInfo } from '@/lib/schemas/downloader'

type VideoPreviewProps = {
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
