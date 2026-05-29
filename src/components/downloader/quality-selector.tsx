'use client'
import { VIDEO_QUALITIES } from '@/lib/download-options'
import type { VideoQuality } from '@/types/downloader'
import { QualityChip } from './quality-chip'

interface QualitySelectorProps {
  value: VideoQuality
  onChange: (v: VideoQuality) => void
  availableHeights?: number[]
}

export function QualitySelector({ value, onChange, availableHeights = [] }: QualitySelectorProps) {
  const options =
    availableHeights.length > 0
      ? VIDEO_QUALITIES.filter(
          (q) => q.value === 'best' || availableHeights.some((h) => String(h) === q.value),
        )
      : VIDEO_QUALITIES

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Qualità
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((q) => (
          <QualityChip
            key={q.value}
            label={q.label}
            active={value === q.value}
            onClick={() => onChange(q.value as VideoQuality)}
          />
        ))}
      </div>
    </div>
  )
}
