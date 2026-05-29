import { Play } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-yt-red shadow-red-glow">
        <Play className="h-7 w-7 fill-white text-white" />
      </div>

      <div>
        <h1 className="font-display text-5xl font-bold tracking-tight leading-none">
          <span className="text-gradient-red">Tube</span>
          <span className="text-foreground">Grab</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-medium tracking-wide">
          Scarica video &amp; audio da YouTube in alta qualità
        </p>
      </div>
    </header>
  )
}
