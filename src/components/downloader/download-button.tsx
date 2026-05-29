'use client'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildDownloadLabel } from '@/lib/download-options'
import type { DownloadOptions } from '@/types/downloader'

interface DownloadButtonProps {
  options: DownloadOptions
  onClick: () => void
}

export function DownloadButton({ options, onClick }: DownloadButtonProps) {
  return (
    <motion.div whileTap={{ scale: 0.97 }}>
      <Button
        type="button"
        onClick={onClick}
        size="lg"
        className="w-full rounded-2xl bg-yt-red hover:bg-yt-red-dark text-white font-bold text-base shadow-red-glow gap-3 py-6"
      >
        <Download className="h-5 w-5" />
        Scarica — {buildDownloadLabel(options)}
      </Button>
    </motion.div>
  )
}
