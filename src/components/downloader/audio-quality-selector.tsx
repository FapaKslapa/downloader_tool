'use client'
import { AUDIO_QUALITIES } from '@/lib/download-options'
import type { AudioQuality } from '@/schemas/downloader'
import { QualityChip } from './quality-chip'

interface AudioQualitySelectorProps {
  value: AudioQuality
  onChange: (v: AudioQuality) => void
}

export function AudioQualitySelector({ value, onChange }: AudioQualitySelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Qualità audio
      </p>
      <div className="flex flex-wrap gap-2">
        {AUDIO_QUALITIES.map((q) => (
          <QualityChip
            key={q.value}
            label={q.label}
            active={value === q.value}
            size="sm"
            onClick={() => onChange(q.value as AudioQuality)}
          />
        ))}
      </div>
    </div>
  )
}
