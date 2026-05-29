import { router } from '@/server/trpc'
import { youtubeRouter } from './youtube'

export const appRouter = router({ youtube: youtubeRouter })
export type AppRouter = typeof appRouter
