'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { DownloadButton } from '@/components/downloader/download-button'
import { FormatPanel } from '@/components/downloader/format-panel'
import { ProgressDialog } from '@/components/downloader/progress-dialog'
import { UrlInput } from '@/components/downloader/url-input'
import { VideoPreview } from '@/components/downloader/video-preview'
import { Button } from '@/components/ui/button'
import { useDownload } from '@/hooks/use-download'
import { useVideoInfo } from '@/hooks/use-video-info'
import { DEFAULT_OPTIONS } from '@/lib/download-options'
import type { DownloadOptions } from '@/lib/schemas/downloader'

export function Downloader() {
  const { videoInfo, isLoading, error, search, reset } = useVideoInfo()
  const { open, state, start, cancel } = useDownload()
  const [options, setOptions] = useState<DownloadOptions>(DEFAULT_OPTIONS)

  return (
    <>
      <div className="flex w-full max-w-xl flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <UrlInput onSubmit={search} isLoading={isLoading} error={error} />
          </div>
          <AnimatePresence>
            {videoInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={reset}
                  title="Nuova ricerca"
                  className="rounded-xl h-10 w-10"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isLoading && !videoInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
            >
              <div className="aspect-video animate-pulse bg-surface-2" />
              <div className="space-y-2.5 p-4">
                <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-surface-2" />
                <div className="h-3 w-1/2 animate-pulse rounded-full bg-surface-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {videoInfo && (
            <motion.div
              key={videoInfo.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-4"
            >
              <VideoPreview info={videoInfo} />
              <FormatPanel
                options={options}
                onChange={setOptions}
                availableHeights={videoInfo.availableHeights}
                hasSubtitles={videoInfo.hasSubtitles}
              />
              <DownloadButton options={options} onClick={() => start(videoInfo.url, options)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProgressDialog
        open={open}
        state={state}
        thumbnail={videoInfo?.thumbnail}
        title={videoInfo?.title}
        onCancel={cancel}
      />
    </>
  )
}
