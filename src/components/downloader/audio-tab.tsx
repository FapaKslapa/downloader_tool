'use client'
import type { AudioFormat, AudioQuality, DownloadOptions } from '@/types/downloader'
import { AudioFormatGrid } from './audio-format-grid'
import { AudioQualitySelector } from './audio-quality-selector'

interface AudioTabProps {
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
