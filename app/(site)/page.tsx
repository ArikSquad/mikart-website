import type { Metadata } from 'next'
import { PageTransition } from '@/components/page-transition'
import { PortfolioPage } from './portfolio/portfolio-page'

export const metadata: Metadata = {
    title: 'ArikSquad — Software & security engineer',
    description:
        'Software engineer in Finland building secure systems, reliable Java infrastructure, web products, and game technology.'
}

export default function Home() {
    return (
        <PageTransition>
            <PortfolioPage />
        </PageTransition>
    )
}
