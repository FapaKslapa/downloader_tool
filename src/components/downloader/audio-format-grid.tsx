'use client'
import { AUDIO_FORMATS } from '@/lib/download-options'
import { cn } from '@/lib/utils'
import type { AudioFormat } from '@/types/downloader'

interface AudioFormatGridProps {
  value: AudioFormat
  onChange: (v: AudioFormat) => void
}

export function AudioFormatGrid({ value, onChange }: AudioFormatGridProps) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Formato audio
      </p>
      <div className="grid grid-cols-4 gap-2">
        {AUDIO_FORMATS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f.value as AudioFormat)}
            className={cn(
              'flex flex-col items-center rounded-xl py-2.5 px-1 transition-all active:scale-95 border',
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
