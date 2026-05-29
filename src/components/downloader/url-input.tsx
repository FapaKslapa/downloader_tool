'use client'
import { ClipboardPaste, Loader2, Search, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface UrlInputProps {
  onSubmit: (url: string) => void
  isLoading: boolean
  error?: string | null
}

export function UrlInput({ onSubmit, isLoading, error }: UrlInputProps) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  async function handlePaste() {
    try {
      setValue((await navigator.clipboard.readText()).trim())
    } catch (_e) {
      void _e
    }
    ref.current?.focus()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim() && !isLoading) onSubmit(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl border bg-surface px-4 py-2.5 transition-all',
          'shadow-card focus-within:shadow-input-focus focus-within:border-yt-red/30',
          error && 'border-destructive/50',
        )}
      >
        <Input
          ref={ref}
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          placeholder="Incolla un link YouTube…"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              setValue('')
              ref.current?.focus()
            }}
            className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1 text-xs font-medium text-yt-red hover:text-yt-red-dark transition-colors"
          >
            <ClipboardPaste className="h-3.5 w-3.5" /> Incolla
          </button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={!value.trim() || isLoading}
          className="rounded-xl bg-yt-red hover:bg-yt-red-dark text-white shadow-red-glow gap-1.5 font-semibold"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Search className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">Cerca</span>
        </Button>
      </div>
      {error && <p className="text-center text-xs text-destructive">{error}</p>}
    </form>
  )
}
