'use client'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc/react'
import type { VideoInfo } from '@/types/downloader'

export function useVideoInfo() {
  const qc = useQueryClient()
  const [queryUrl, setQueryUrl] = useState('')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)

  const query = trpc.youtube.getInfo.useQuery(
    { url: queryUrl },
    { enabled: !!queryUrl, retry: false },
  )

  useEffect(() => {
    if (query.data) setVideoInfo(query.data as VideoInfo)
  }, [query.data])

  const search = (url: string) => {
    setVideoInfo(null)
    setQueryUrl(url)
  }

  const reset = () => {
    setQueryUrl('')
    setVideoInfo(null)
    qc.removeQueries({ queryKey: [['youtube', 'getInfo']] })
  }

  return {
    videoInfo,
    isLoading: query.isFetching,
    error: query.error?.message ?? null,
    search,
    reset,
  }
}
