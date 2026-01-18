import { RootProvider } from 'fumadocs-ui/provider/next'
import type { ReactNode } from 'react'
import '@/styles/fumadocs.css'

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <RootProvider>{children}</RootProvider>
    )
}
