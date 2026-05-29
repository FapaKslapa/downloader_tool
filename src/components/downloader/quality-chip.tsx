'use client'
import { cn } from '@/lib/utils'

interface QualityChipProps {
  label: string
  active: boolean
  onClick: () => void
  size?: 'sm' | 'md'
}

export function QualityChip({ label, active, onClick, size = 'md' }: QualityChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full font-medium transition-all active:scale-95',
        size === 'md' ? 'px-3.5 py-1.5 text-sm' : 'px-3 py-1 text-xs',
        active
          ? 'bg-yt-red text-white shadow-red-glow'
          : 'bg-surface-2 text-muted-foreground hover:bg-yt-red/10 hover:text-yt-red',
      )}
    >
      {label}
    </button>
  )
}
