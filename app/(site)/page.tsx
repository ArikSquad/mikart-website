import type { Metadata } from 'next'
import { PageTransition } from '@/components/page-transition'
import { PortfolioPage } from './portfolio/portfolio-page'
import './portfolio/portfolio.css'

export const metadata: Metadata = {
    title: 'ArikSquad — Software engineer',
    description:
        'Software developer in Finland building reliable Java systems, type-safe infrastructure, web products, and game technology.'
}

export default function Home() {
    return (
        <PageTransition>
            <PortfolioPage />
        </PageTransition>
    )
}
