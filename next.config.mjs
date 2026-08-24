import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
    allowedDevOrigins: ['127.0.0.1'],
    // Cache Components gives every route a static shell, while Partial
    // Prefetching reuses that shell between links instead of fetching a full
    // dynamic route for every visible link.
    cacheComponents: true,
    partialPrefetching: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.mikart.eu',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '/**'
            }
        ]
    },
    reactStrictMode: true,
    redirects: async () => [
        {
            source: '/help-center/:slug*',
            destination: '/docs/:slug*',
            permanent: true
        },
        { source: '/flow/discord', destination: 'https://discord.gg/SuXGbq24wA', permanent: true },
        { source: '/flow/earth', destination: 'https://earth.mikart.eu/', permanent: true },
        { source: '/flow/store', destination: 'https://store.mikart.eu/', permanent: true }
    ],
    experimental: {
        globalNotFound: true
    }
}

export default withMDX(config)
