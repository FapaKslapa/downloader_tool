'use client'
import { invoke } from '@tauri-apps/api/core'
import { useState } from 'react'
import type { VideoInfo } from '@/lib/schemas/downloader'

export function useVideoInfo() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (url: string) => {
    setIsLoading(true)
    setError(null)
    setVideoInfo(null)
    try {
      const info = await invoke<VideoInfo>('get_video_info', { url })
      setVideoInfo(info)
    } catch (err) {
      setError(typeof err === 'string' ? err : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setVideoInfo(null)
    setError(null)
  }

  return {
    videoInfo,
    isLoading,
    error,
    search,
    reset,
  }
}
