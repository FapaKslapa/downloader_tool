'use client'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { useRef, useState } from 'react'
import type { DownloadOptions, ProgressState } from '@/schemas/downloader'

const initState = (): ProgressState => ({
  phase: 'starting',
  percent: 0,
  speed: '',
  eta: '',
  size: '',
  filename: '',
  error: '',
})

interface ProgressPayload {
  type: string
  percent?: number
  size?: string
  speed?: string
  eta?: string
  phase: number
  message?: string
  filename?: string
}

export function useDownload() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<ProgressState>(initState())
  const unlistenRef = useRef<(() => void) | null>(null)

  function cleanup() {
    if (unlistenRef.current) {
      unlistenRef.current()
      unlistenRef.current = null
    }
  }

  async function start(url: string, opts: DownloadOptions) {
    setState(initState())
    setOpen(true)
    cleanup()

    try {
      const unlisten = await listen<ProgressPayload>('download-progress', (event) => {
        const payload = event.payload
        const t = payload.type

        if (t === 'phase') {
          setState((prev) => ({
            ...prev,
            phase: payload.phase > 1 ? 'audio' : 'downloading',
            percent: 0,
          }))
        } else if (t === 'progress') {
          setState((prev) => ({
            ...prev,
            phase:
              prev.phase === 'merging' ? 'merging' : payload.phase > 1 ? 'audio' : 'downloading',
            percent: payload.percent ?? 0,
            speed: payload.speed ?? '',
            eta: payload.eta ?? '',
            size: payload.size ?? '',
          }))
        } else if (t === 'merging') {
          setState((prev) => ({ ...prev, phase: 'merging', percent: 100 }))
        } else if (t === 'complete') {
          setState((prev) => ({
            ...prev,
            phase: 'complete',
            percent: 100,
            filename: payload.filename ?? 'Completato',
          }))
          cleanup()
        } else if (t === 'error') {
          setState((prev) => ({
            ...prev,
            phase: 'error',
            error: payload.message ?? 'Errore di download',
          }))
          cleanup()
        }
      })

      unlistenRef.current = unlisten

      await invoke('download_video', {
        url,
        downloadType: opts.type,
        videoFormat: opts.videoFormat,
        videoQuality: opts.videoQuality,
        audioFormat: opts.audioFormat,
        audioQuality: opts.audioQuality,
        embedSubs: opts.embedSubs,
        embedThumbnail: opts.embedThumbnail,
        embedMetadata: opts.embedMetadata,
      })
    } catch (err) {
      setState((prev) => ({ ...prev, phase: 'error', error: String(err) }))
      cleanup()
    }
  }

  function cancel() {
    cleanup()
    setOpen(false)
    setState(initState())
  }

  return { open, state, start, cancel }
}
