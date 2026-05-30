'use client'
import { Switch } from '@/components/ui/switch'
import type { DownloadOptions } from '@/lib/schemas/downloader'

type ExtraTogglesProps = {
  options: DownloadOptions
  onChange: <K extends keyof DownloadOptions>(key: K, val: DownloadOptions[K]) => void
  hasSubtitles: boolean
}

function ToggleRow({
  label,
  sub,
  checked,
  onToggle,
}: {
  label: string
  sub: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center justify-between py-2"
      onClick={onToggle}
    >
      <div className="text-left">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-yt-red"
      />
    </button>
  )
}

export function ExtraToggles({ options, onChange, hasSubtitles }: ExtraTogglesProps) {
  return (
    <div className="divide-y divide-border">
      <ToggleRow
        label="Incorpora copertina"
        sub="Aggiunge thumbnail al file"
        checked={options.embedThumbnail}
        onToggle={() => onChange('embedThumbnail', !options.embedThumbnail)}
      />
      <ToggleRow
        label="Scrivi metadati"
        sub="Titolo, artista, anno"
        checked={options.embedMetadata}
        onToggle={() => onChange('embedMetadata', !options.embedMetadata)}
      />
      {hasSubtitles && options.type === 'video' && (
        <ToggleRow
          label="Incorpora sottotitoli"
          sub="Tutti i sottotitoli disponibili"
          checked={options.embedSubs}
          onToggle={() => onChange('embedSubs', !options.embedSubs)}
        />
      )}
    </div>
  )
}
