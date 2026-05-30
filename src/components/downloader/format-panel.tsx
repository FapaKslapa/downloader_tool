'use client'
import { ChevronDown, Music, Video } from 'lucide-react'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEFAULT_OPTIONS } from '@/lib/download-options'
import type { DownloadOptions } from '@/schemas/downloader'
import { AudioTab } from './audio-tab'
import { ExtraToggles } from './extra-toggles'
import { VideoTab } from './video-tab'

type FormatPanelProps = {
  options: DownloadOptions
  onChange: (opts: DownloadOptions) => void
  availableHeights?: number[]
  hasSubtitles?: boolean
}

export function FormatPanel({
  options,
  onChange,
  availableHeights = [],
  hasSubtitles = false,
}: FormatPanelProps) {
  const [showExtra, setShowExtra] = useState(false)
  const set = <K extends keyof DownloadOptions>(key: K, val: DownloadOptions[K]) =>
    onChange({ ...options, [key]: val })

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <Tabs value={options.type} onValueChange={(v) => set('type', v as DownloadOptions['type'])}>
        <TabsList className="w-full rounded-none border-b border-border bg-transparent h-auto p-0">
          {(['video', 'audio'] as const).map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="flex-1 gap-2 rounded-none py-3.5 text-sm font-semibold data-[state=active]:text-yt-red data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-yt-red border-b-2 border-transparent"
            >
              {t === 'video' ? <Video className="h-4 w-4" /> : <Music className="h-4 w-4" />}
              {t === 'video' ? 'Video' : 'Solo audio'}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="p-5 space-y-5">
          <TabsContent value="video" className="mt-0">
            <VideoTab options={options} onChange={set} availableHeights={availableHeights} />
          </TabsContent>
          <TabsContent value="audio" className="mt-0">
            <AudioTab options={options} onChange={set} />
          </TabsContent>

          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setShowExtra((v) => !v)}
              className="flex w-full items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showExtra ? 'rotate-180' : ''}`}
              />
              Opzioni avanzate
            </button>
            {showExtra && (
              <div className="mt-3">
                <ExtraToggles options={options} onChange={set} hasSubtitles={hasSubtitles} />
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}

export { DEFAULT_OPTIONS }
