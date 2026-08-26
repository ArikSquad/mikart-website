import type { Metadata } from 'next'
import { PageTransition } from '@/components/page-transition'
import { LandingExperience } from './portfolio/landing-style'
import './portfolio/landing-style.css'
import './portfolio/minimal.css'
import './portfolio/portfolio.css'

export const metadata: Metadata = {
    title: 'ArikSquad — Software engineer',
    description:
        'Software developer in Finland building reliable Java systems, type-safe infrastructure, web products, and game technology.'
}

export default function Home() {
    return (
        <PageTransition>
            <LandingExperience />
        </PageTransition>
    )
}
