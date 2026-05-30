import { AlertCircle, CheckCircle2, Film } from 'lucide-react'
import type { DownloadPhase } from '@/types/downloader'

interface ArcProgressProps {
  percent: number
  phase: DownloadPhase
}

export function ArcProgress({ percent, phase }: ArcProgressProps) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ
  const isMerging = phase === 'merging' || phase === 'starting'
  const isComplete = phase === 'complete'
  const isError = phase === 'error'

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="-rotate-90 h-full w-full" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="oklch(1 0 0 / 6%)" strokeWidth="8" />
        {!isError && (
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={isComplete ? 'oklch(0.72 0.17 155)' : 'oklch(0.628 0.258 29.23)'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={isMerging ? circ * 0.8 : offset}
            style={
              isMerging
                ? { animation: 'spin 1.4s linear infinite', transformOrigin: 'center' }
                : { transition: 'stroke-dashoffset 0.3s ease' }
            }
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isComplete ? (
          <CheckCircle2 className="h-12 w-12 text-green-400" />
         ) : isError ? (
          <AlertCircle className="h-12 w-12 text-destructive" />
         ) : isMerging ? (
          <Film className="h-8 w-8 text-primary animate-pulse" />
         ) : (
          <>
            <span className="font-display text-2xl font-bold tabular-nums">
              {Math.round(percent)}
            </span>
            <span className="text-xs text-muted-foreground">%</span>
          </>
        )}
      </div>
    </div>
  )
}
