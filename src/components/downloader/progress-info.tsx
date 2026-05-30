import { Loader2 } from 'lucide-react'
import type { DownloadPhase, ProgressState } from '@/schemas/downloader'

const PHASE_LABEL: Record<DownloadPhase, string> = {
  starting: 'Connessione…',
  downloading: 'Download video…',
  audio: 'Download audio…',
  merging: 'Unione tracce…',
  complete: 'Download completato!',
  error: 'Errore',
}
const PHASE_COLOR: Record<DownloadPhase, string> = {
  starting: 'text-muted-foreground',
  downloading: 'text-yt-red',
  audio: 'text-yt-red',
  merging: 'text-yt-red',
  complete: 'text-green-400',
  error: 'text-destructive',
}

interface ProgressInfoProps {
  state: ProgressState
  title?: string
}

export function ProgressInfo({ state, title }: ProgressInfoProps) {
  const { phase, speed, size, eta, filename, error } = state
  return (
    <div className="space-y-1 text-center">
      <p className={`font-display text-base font-semibold ${PHASE_COLOR[phase]}`}>
        {PHASE_LABEL[phase]}
      </p>
      {title && phase !== 'complete' && phase !== 'error' && (
        <p className="line-clamp-2 text-xs text-muted-foreground">{title}</p>
      )}
      {phase === 'complete' && filename && (
        <p className="break-all font-mono text-[10px] text-muted-foreground">{filename}</p>
      )}
      {phase === 'error' && error && <p className="text-xs text-muted-foreground">{error}</p>}
      {(phase === 'downloading' || phase === 'audio') && speed && (
        <div className="flex justify-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium">{speed}</span>
          {size && <span>{size}</span>}
          {eta && eta !== '00:00' && <span>ETA {eta}</span>}
        </div>
      )}
      {(phase === 'merging' || phase === 'starting') && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {phase === 'merging' ? 'Elaborazione ffmpeg…' : 'Avvio…'}
        </div>
      )}
    </div>
  )
}
