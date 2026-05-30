'use client'
import { AudioFormatGrid } from '@/components/downloader/audio-format-grid'
import { AudioQualitySelector } from '@/components/downloader/audio-quality-selector'
import type { AudioFormat, AudioQuality, DownloadOptions } from '@/lib/schemas/downloader'

type AudioTabProps = {
  options: DownloadOptions
  onChange: <K extends keyof DownloadOptions>(key: K, val: DownloadOptions[K]) => void
}

export function AudioTab({ options, onChange }: AudioTabProps) {
  return (
    <div className="space-y-5">
      <AudioFormatGrid
        value={options.audioFormat}
        onChange={(v) => onChange('audioFormat', v as AudioFormat)}
      />
      <AudioQualitySelector
        value={options.audioQuality}
        onChange={(v) => onChange('audioQuality', v as AudioQuality)}
      />
    </div>
  )
}
