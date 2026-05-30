import Image from 'next/image'
import { formatDuration } from '@/lib/time'

type VideoThumbnailProps = {
  src: string
  alt: string
  duration: number
  isLive: boolean
}

export function VideoThumbnail({ src, alt, duration, isLive }: VideoThumbnailProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-surface-2">
      <Image src={src} alt={alt} fill className="object-cover" unoptimized priority />
      {isLive && (
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-yt-red px-2.5 py-1 text-xs font-bold text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          LIVE
        </span>
      )}
      {!isLive && duration > 0 && (
        <span className="absolute bottom-2.5 right-2.5 rounded-lg bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {formatDuration(duration)}
        </span>
      )}
    </div>
  )
}
