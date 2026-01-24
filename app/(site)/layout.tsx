import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'

import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import React from 'react'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/app/ConvexClientProvider'
import {metadata as m} from "@/types/metadata";

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

export const metadata: Metadata = m;

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <ClerkProvider>
                        <ConvexClientProvider>
                            {children}

                            <Toaster position="top-center" />
                        </ConvexClientProvider>
                    </ClerkProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
