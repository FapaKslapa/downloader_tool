'use client'
import { VIDEO_FORMATS } from '@/lib/download-options'
import { cn } from '@/lib/utils'
import type { VideoFormat } from '@/schemas/downloader'

type ContainerSelectorProps = {
  value: VideoFormat
  onChange: (v: VideoFormat) => void
}

export function ContainerSelector({ value, onChange }: ContainerSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Contenitore
      </p>
      <div className="grid grid-cols-3 gap-2">
        {VIDEO_FORMATS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f.value as VideoFormat)}
            className={cn(
              'flex flex-col items-center rounded-xl py-2.5 px-2 transition-all active:scale-95 border',
              value === f.value
                ? 'bg-yt-red/10 border-yt-red/40 text-yt-red shadow-red-glow'
                : 'bg-surface-2 border-transparent text-muted-foreground hover:border-yt-red/20 hover:text-foreground',
            )}
          >
            <span className="text-sm font-bold">{f.label}</span>
            <span className="text-[10px] mt-0.5 opacity-70">{f.sub}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
