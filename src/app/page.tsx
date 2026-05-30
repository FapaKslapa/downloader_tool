import { Downloader } from '@/components/downloader'
import { BgOrbs } from '@/components/layout/bg-orbs'
import { SiteHeader } from '@/components/layout/site-header'

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <BgOrbs />
      <main className="relative z-10 flex flex-col items-center gap-10 px-4 py-16 sm:py-24">
        <SiteHeader />
        <Downloader />
      </main>
    </div>
  )
}
