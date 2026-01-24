import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'

import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import type { Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/app/ConvexClientProvider'

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

interface RootLayoutProps {
    children: React.ReactNode
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' }
    ]
}

export const metadata = {
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

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <ClerkProvider>
                        <ConvexClientProvider>
                            {children}

                            <Toaster />
                            <SonnerToaster richColors position="top-center" />
                        </ConvexClientProvider>
                    </ClerkProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
