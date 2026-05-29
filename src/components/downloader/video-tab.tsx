'use client'
import type { DownloadOptions, VideoFormat, VideoQuality } from '@/types/downloader'
import { ContainerSelector } from './container-selector'
import { QualitySelector } from './quality-selector'

interface VideoTabProps {
  options: DownloadOptions
  onChange: <K extends keyof DownloadOptions>(key: K, val: DownloadOptions[K]) => void
  availableHeights: number[]
}

export function VideoTab({ options, onChange, availableHeights }: VideoTabProps) {
  return (
    <div className="space-y-5">
      <QualitySelector
        value={options.videoQuality}
        onChange={(v) => onChange('videoQuality', v as VideoQuality)}
        availableHeights={availableHeights}
      />
      <ContainerSelector
        value={options.videoFormat}
        onChange={(v) => onChange('videoFormat', v as VideoFormat)}
      />
    </div>
  )
}
