'use client'
import { useRef, useState } from 'react'
import type { DownloadOptions, DownloadPhase, ProgressState } from '@/types/downloader'

const initState = (): ProgressState => ({
  phase: 'starting',
  percent: 0,
  speed: '',
  eta: '',
  size: '',
  filename: '',
  error: '',
})

type SseEvent = Record<string, unknown>

export function useDownload() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<ProgressState>(initState())
  const esRef = useRef<EventSource | null>(null)

  function triggerFileDownload(id: string, filename: string) {
    const a = document.createElement('a')
    a.href = `/api/file?id=${id}`
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function handleEvent(ev: SseEvent, es: EventSource) {
    const t = ev.type as string
    if (t === 'start') {
      setState((prev) => ({ ...prev, phase: 'downloading' as DownloadPhase }))
    } else if (t === 'phase') {
      setState((prev) => ({
        ...prev,
        phase: (ev.phase as number) > 1 ? 'audio' : 'downloading',
        percent: 0,
      }))
    } else if (t === 'progress') {
      setState((prev) => ({
        ...prev,
        phase:
          prev.phase === 'merging'
            ? prev.phase
            : (((ev.phase as number) > 1 ? 'audio' : 'downloading') as DownloadPhase),
        percent: ev.percent as number,
        speed: ev.speed as string,
        eta: ev.eta as string,
        size: ev.size as string,
      }))
    } else if (t === 'merging') {
      setState((prev) => ({ ...prev, phase: 'merging', percent: 100 }))
    } else if (t === 'complete') {
      const id = ev.id as string
      const filename = ev.filename as string
      setState((prev) => ({ ...prev, phase: 'complete', percent: 100, filename }))
      es.close()
      triggerFileDownload(id, filename)
    } else if (t === 'error') {
      setState((prev) => ({ ...prev, phase: 'error', error: ev.message as string }))
      es.close()
    }
  }

  function start(url: string, opts: DownloadOptions) {
    const params = new URLSearchParams({
      url,
      type: opts.type,
      videoFormat: opts.videoFormat,
      videoQuality: opts.videoQuality,
      audioFormat: opts.audioFormat,
      audioQuality: opts.audioQuality,
      embedSubs: String(opts.embedSubs),
      embedThumbnail: String(opts.embedThumbnail),
      embedMetadata: String(opts.embedMetadata),
    })
    setState(initState())
    setOpen(true)
    const es = new EventSource(`/api/download?${params}`)
    esRef.current = es
    es.onmessage = (e) => handleEvent(JSON.parse(e.data as string) as SseEvent, es)
    es.onerror = () => {
      setState((prev) => ({ ...prev, phase: 'error', error: 'Connessione interrotta.' }))
      es.close()
    }
  }

  function cancel() {
    esRef.current?.close()
    esRef.current = null
    setOpen(false)
    setState(initState())
  }

  return { open, state, start, cancel }
}
