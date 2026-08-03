import type { Metadata } from 'next'
import { PortfolioPage } from './portfolio/portfolio-page'
import './portfolio/portfolio.css'

export const metadata: Metadata = {
    title: 'ArikSquad — Software, shipped clean',
    description:
        'Software developer in Finland building reliable Java systems, type-safe infrastructure, web products, and game technology.'
}

export default function Home() {
    return <PortfolioPage />
}
