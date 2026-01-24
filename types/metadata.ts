import type {Metadata} from "next";

export const metadata: Metadata = {
    title: {
        default: 'MikArt Europe',
        template: `%s | MikArt Europe`
    },
    description:
        'MikArt Europe is designed to be a place to unite our interesting projects. We are a group of people who are passionate about technology and design.',
    keywords: ['MikArt', 'Software Development', 'MikArt Europe'],
    authors: [
        {
            name: 'ArikSquad',
            url: 'https://github.com/ArikSquad'
        }
    ],
    creator: 'ariksquad',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://www.mikart.eu',
        title: 'MikArt Europe',
        description:
            'MikArt Europe is designed to be a place to unite our interesting projects. We are a group of people who are passionate about technology and design.',
        siteName: 'MikArt Europe'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MikArt Europe',
        description:
            'MikArt Europe is designed to be a place to unite our interesting projects. We are a group of people who are passionate about technology and design.',
        images: [`https://www.mikart.eu/og.jpg`],
        creator: '@ArikSquad'
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png'
    },
    manifest: `https://www.mikart.eu/site.webmanifest`
}