'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { LandingStyle } from './landing-style'

const selectedWork = [
    {
        year: '2026',
        name: 'tava',
        description: 'typed data layer for Java',
        href: '/docs/tava'
    },
    {
        year: '2026',
        name: 'hypixel recreation',
        description: 'a Minecraft platform with room to grow',
        href: 'https://github.com/Swofty-Developments/HypixelRecreation',
        external: true
    },
    {
        year: '2025',
        name: 'salattu',
        description: 'cross-platform password manager, Rust core',
        href: 'https://salattu.mikart.eu',
        external: true
    },
    {
        year: '2025',
        name: 'ensave',
        description: 'community operations, made repeatable',
        href: 'https://ensave.mikart.eu',
        external: true
    },
    {
        year: '2025',
        name: 'mikart docs',
        description: 'APIs, setup, and decisions',
        href: '/docs'
    }
] as const

export function MinimalPortfolioPage({
    styleControl,
    onChooseStyle
}: {
    styleControl?: ReactNode
    onChooseStyle?: (style: LandingStyle) => void
}) {
    const [currentYear, setCurrentYear] = useState<number | null>(null)

    useEffect(() => {
        setCurrentYear(new Date().getFullYear())
    }, [])

    return (
        <main className="minimal-portfolio" id="top">
            <div className="minimal-page">
                <header className="minimal-header">
                    <div>
                        <p className="minimal-name">ari</p>
                        <p className="minimal-role">creative developer — finland</p>
                    </div>
                    <div className="minimal-header-actions">
                        {onChooseStyle && (
                            <button
                                type="button"
                                className="minimal-header-link minimal-maximal-link"
                                onClick={() => onChooseStyle('maximal')}
                            >
                                see maximal
                            </button>
                        )}
                        <Link className="minimal-header-link" href="/blog" transitionTypes={['nav-forward']}>
                            blog
                        </Link>
                    </div>
                </header>

                <section className="minimal-intro" aria-labelledby="minimal-intro-title">
                    <h1 id="minimal-intro-title" className="sr-only">
                        Ari, creative developer in Finland
                    </h1>
                    <p>
                        I build <strong>careful software</strong>: interfaces with nothing extra, tools that respect
                        your attention, and the occasional shader nobody asked for. Currently engineering at{' '}
                        <a href="https://www.mikart.eu" target="_blank" rel="noreferrer">
                            mikart europe
                        </a>
                        .
                    </p>
                </section>

                <section className="minimal-work" id="work" aria-labelledby="minimal-work-title">
                    <p id="minimal-work-title" className="minimal-section-label">
                        selected work
                    </p>
                    <div className="minimal-work-list">
                        {selectedWork.map((work) => (
                            <Link
                                key={work.name}
                                className="minimal-work-row"
                                href={work.href}
                                target={'external' in work && work.external ? '_blank' : undefined}
                                rel={'external' in work && work.external ? 'noreferrer' : undefined}
                                transitionTypes={!('external' in work && work.external) ? ['nav-forward'] : undefined}
                            >
                                <span className="minimal-work-year">{work.year}</span>
                                <strong className="minimal-work-name">{work.name}</strong>
                                <span className="minimal-work-description">{work.description}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="minimal-elsewhere" aria-labelledby="minimal-elsewhere-title">
                    <p id="minimal-elsewhere-title" className="minimal-section-label">
                        elsewhere
                    </p>
                    <nav className="minimal-links" aria-label="Elsewhere">
                        <Link href="/blog" transitionTypes={['nav-forward']}>
                            blog
                        </Link>
                        <a href="mailto:ariksquad@mikart.eu">ariksquad@mikart.eu</a>
                        <a href="https://github.com/ArikSquad" target="_blank" rel="noreferrer">
                            github
                        </a>
                        <a href="https://x.com/ArikSquad" target="_blank" rel="noreferrer">
                            x
                        </a>
                        <a href="https://bsky.app/profile/ariksquad.mikart.eu" target="_blank" rel="noreferrer">
                            bluesky
                        </a>
                        <Link href="/flow/discord">dc</Link>
                    </nav>
                </section>

                <footer className="minimal-footer">
                    <div className="minimal-footer-meta">
                        <span>© {currentYear ?? ''} ArikSquad / MikArt Europe</span>
                        <a href="https://github.com/ArikSquad/mikart-website" target="_blank" rel="noreferrer">
                            view source
                        </a>
                        <a href="#top">top ↑</a>
                    </div>
                    {styleControl}
                </footer>
            </div>
        </main>
    )
}
