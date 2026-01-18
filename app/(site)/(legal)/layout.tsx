import Footer from '@/components/footer'
import { MainNav } from '@/components/taxomony/main-nav'
import React from 'react'
import { mainNavItems } from '@/lib/navigation'

interface MarketingLayoutProps {
    children: React.ReactNode
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="mx-auto max-w-7xl px-4 z-40 bg-background">
                <div className="flex h-20 items-center justify-between py-6">
                    <MainNav items={mainNavItems} />
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <div className="mt-48">
                <Footer />
            </div>
        </div>
    )
}
