import posthog from 'posthog-js'
import { env } from '~/env.mjs'

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-11-30'
})
