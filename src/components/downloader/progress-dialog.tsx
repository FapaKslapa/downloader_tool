'use client'
import Image from 'next/image'
import { ArcProgress } from '@/components/downloader/arc-progress'
import { ProgressInfo } from '@/components/downloader/progress-info'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { ProgressState } from '@/lib/schemas/downloader'

type ProgressDialogProps = {
  open: boolean
  state: ProgressState
  thumbnail?: string
  title?: string
  onCancel: () => void
}

export function ProgressDialog({ open, state, thumbnail, title, onCancel }: ProgressDialogProps) {
  const { phase } = state
  const isDone = phase === 'complete' || phase === 'error'

  return (
    <Dialog open={open} onOpenChange={(v) => !v && isDone && onCancel()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-xs overflow-hidden rounded-2xl border-border bg-card p-0 shadow-card"
      >
        {thumbnail && (
          <div className="relative h-20 overflow-hidden">
            <Image
              src={thumbnail}
              alt="thumbnail"
              fill
              className="scale-110 object-cover blur-sm brightness-50"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
          </div>
        )}
        <div className="flex flex-col items-center gap-4 px-6 pb-6 pt-4 text-center">
          <ArcProgress percent={state.percent} phase={phase} />
          <ProgressInfo state={state} title={title} />

          {phase === 'complete' && (
            <Button
              onClick={onCancel}
              className="w-full rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              Perfetto!
            </Button>
          )}
          {phase === 'error' && (
            <Button variant="secondary" onClick={onCancel} className="w-full rounded-xl">
              Chiudi
            </Button>
          )}
          {!isDone && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Annulla
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
