import type { Metadata } from 'next'
import { PageTransition } from '@/components/page-transition'
import { PortfolioPage } from './portfolio/portfolio-page'

const discordComponentEmbed = JSON.stringify({
    component: {
        type: 17,
        accent_color: 5793266,
        components: [
            {
                type: 10,
                content:
                    '# MikArt Europe\nA project cluster led by the Finnish software ArikSquad building something cool.'
            },
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 5,
                        url: 'https://github.com/ArikSquad',
                        label: 'GitHub'
                    },
                    {
                        type: 2,
                        style: 5,
                        url: 'https://x.com/ArikSquad',
                        label: 'X'
                    },
                    {
                        type: 2,
                        style: 5,
                        url: 'https://www.mikart.eu/',
                        label: 'View portfolio'
                    }
                ]
            }
        ]
    }
})

export const metadata: Metadata = {
    title: 'MikArt Europe',
    description: 'A project cluster led by the Finnish software ArikSquad building something cool.',
    openGraph: {
        title: 'MikArt Europe',
        description: 'A project cluster led by the Finnish software ArikSquad building something cool.',
        url: 'https://www.mikart.eu',
        type: 'website'
    },
    twitter: {
        card: 'summary',
        title: 'MikArt Europe',
        description: 'A project cluster led by the Finnish software ArikSquad building something cool.'
    }
}

export default function Home() {
    return (
        <>
            <script
                id="discord:component-embed"
                type="application/json"
                dangerouslySetInnerHTML={{ __html: discordComponentEmbed }}
            />
            <PageTransition>
                <PortfolioPage />
            </PageTransition>
        </>
    )
}
