import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '"www.mikart.eu',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**'
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
    ]
}

export default withMDX(config)
