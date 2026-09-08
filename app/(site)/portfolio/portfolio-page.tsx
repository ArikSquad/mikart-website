import Link from 'next/link'
import { ArrowUpRight, Heart } from 'lucide-react'
import { TechStackDialog } from './tech-stack-dialog'
import { SiHearth } from '@icons-pack/react-simple-icons'
import { ReactNode } from 'react'

type Project = {
    year: string
    name: string
    description: string
    href?: string
    external?: boolean
}

type WorkCategory = {
    name: string
    projects: Project[]
}

const workCategories: WorkCategory[] = [
    {
        name: 'software & systems',
        projects: [
            { year: '2026', name: 'tava', description: 'typed data layer for Java', href: '/docs/tava' },
            {
                year: '2026',
                name: 'hypixel recreation',
                description: 'contributed to a Minecraft server platform & microservices',
                href: 'https://github.com/Swofty-Developments/HypixelRecreation',
                external: true
            }
        ]
    },
    {
        name: 'products & platforms',
        projects: [
            {
                year: '2026',
                name: 'salattu',
                description: 'cross-platform password manager',
                href: 'https://salattu.mikart.eu',
                external: true
            },
            {
                year: '2025',
                name: 'ensave',
                description: 'Discord community management platform',
                href: 'https://ensave.mikart.eu',
                external: true
            },
            {
                year: '2025',
                name: '[private project]',
                description: 'worked on infra, proxies, etc to deploy a platform for 10k users'
            }
        ]
    },
    {
        name: 'security',
        projects: [
            {
                year: '2026',
                name: 'bug bounties',
                description: 'rewarded vulnerability research & disclosure'
            }
        ]
    }
] as const

const secondaryLink =
    'border-b border-[#343330] pb-1 text-[#97938c] transition-colors hover:border-[#e4e2de] hover:text-[#e4e2de] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#97938c]'

export function PortfolioPage() {
    return (
        <main id="top" className="min-h-svh bg-[#111111] font-mono text-sm tracking-[-0.015em] text-[#e4e2de]">
            <div className="mx-auto flex min-h-svh w-full max-w-202 flex-col px-4 pt-[clamp(4.25rem,13vh,9.575rem)] pb-8 sm:px-6">
                <header className="flex items-start justify-between gap-6 sm:gap-8">
                    <div>
                        <p className="m-0 text-base leading-none font-bold">artturi k.</p>
                        <p className="mt-2.5 mb-0 leading-tight text-[#97938c]">software engineer — finland</p>
                    </div>
                    <div className="flex items-baseline gap-3 sm:gap-5">
                        <TechStackDialog />
                        <Link className={`${secondaryLink} text-xs`} href="/blog" transitionTypes={['nav-forward']}>
                            blog
                        </Link>
                    </div>
                </header>

                <section className="mt-[clamp(5.25rem,8vh,7.875rem)] max-w-155" aria-labelledby="intro-title">
                    <h1 id="intro-title" className="sr-only">
                        Artturi, software engineer in Finland
                    </h1>
                    <p className="m-0 text-[clamp(0.875rem,1.55vw,1rem)] leading-[1.62]">
                        I build <strong className="font-bold">reliable software and developer tools</strong>, with a
                        focus on building something cool. I'm a Linux nerd. Based in Finland and working on{' '}
                        <a className={secondaryLink} href="https://www.mikart.eu" target="_blank" rel="noreferrer">
                            mikart europe
                        </a>
                        .
                    </p>
                </section>

                <section className="mt-[clamp(4.875rem,6vh,7.25rem)]" id="work" aria-labelledby="work-title">
                    <p id="work-title" className="m-0 text-[#97938c]">
                        selected work
                    </p>
                    {workCategories.map((category) => (
                        <div className="mt-8" key={category.name}>
                            <h2 className="m-0 text-[11px] leading-none font-medium tracking-[0.08em] text-[#97938c] uppercase">
                                {category.name}
                            </h2>
                            <div className="mt-2.5">
                                {category.projects.map((work) => {
                                    const S = ({ children }: { children: ReactNode }) =>
                                        work.href ? (
                                            <Link
                                                className="group grid grid-cols-[42px_minmax(0,1fr)_14px] items-baseline gap-x-2.5 py-2 leading-[1.4] text-[#97938c] transition-colors hover:text-[#e4e2de] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#97938c] sm:grid-cols-[48px_minmax(110px,.48fr)_minmax(0,1fr)_14px] sm:gap-x-3"
                                                href={work.href}
                                                target={work.external ? '_blank' : undefined}
                                                rel={work.external ? 'noreferrer' : undefined}
                                                transitionTypes={!work.external ? ['nav-forward'] : undefined}
                                            >
                                                {children}
                                            </Link>
                                        ) : (
                                            <span className="group grid grid-cols-[42px_minmax(0,1fr)_14px] items-baseline gap-x-2.5 py-2 leading-[1.4] text-[#97938c] transition-colors hover:text-[#e4e2de] sm:grid-cols-[48px_minmax(110px,.48fr)_minmax(0,1fr)_14px] sm:gap-x-3">
                                                {children}
                                            </span>
                                        )
                                    return (
                                        <S key={work.name}>
                                            <span className="text-xs text-[#6e6b66]">{work.year}</span>

                                            <strong className="truncate font-medium text-[#e4e2de] group-hover:text-white">
                                                {work.name}
                                            </strong>

                                            <span className="col-start-2 text-xs leading-[1.45] sm:col-auto sm:text-sm">
                                                {work.description}
                                            </span>

                                            {work.href ? (
                                                <ArrowUpRight
                                                    className="col-start-3 row-start-1 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:col-start-4"
                                                    aria-hidden="true"
                                                    size={13}
                                                />
                                            ) : null}
                                        </S>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </section>

                <section className="mt-[clamp(5.125rem,8vh,8.25rem)]" aria-labelledby="elsewhere-title">
                    <p id="elsewhere-title" className="m-0 text-[#97938c]">
                        elsewhere
                    </p>
                    <nav
                        className="mt-6 flex flex-wrap gap-x-6 gap-y-4 leading-[1.4] text-[#97938c]"
                        aria-label="Elsewhere"
                    >
                        <Link className={secondaryLink} href="/blog" transitionTypes={['nav-forward']}>
                            blog
                        </Link>
                        <a className={secondaryLink} href="mailto:ariksquad@mikart.eu">
                            ariksquad@mikart.eu
                        </a>
                        <a
                            className={secondaryLink}
                            href="https://github.com/ArikSquad"
                            target="_blank"
                            rel="noreferrer"
                        >
                            github
                        </a>
                        <a className={secondaryLink} href="https://x.com/ArikSquad" target="_blank" rel="noreferrer">
                            x
                        </a>
                        <a
                            className={secondaryLink}
                            href="https://bsky.app/profile/ariksquad.mikart.eu"
                            target="_blank"
                            rel="noreferrer"
                        >
                            bluesky
                        </a>
                        <Link className={secondaryLink} href="/flow/discord">
                            dc
                        </Link>
                    </nav>
                </section>

                <footer className="mt-auto flex items-baseline justify-between gap-7 pt-[clamp(4.75rem,12vh,8.5rem)] text-xs leading-[1.4] text-[#97938c] max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-6">
                    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                        <span>ArikSquad / MikArt Europe</span>
                        <a
                            className={secondaryLink}
                            href="https://github.com/ArikSquad/mikart-website"
                            target="_blank"
                            rel="noreferrer"
                        >
                            view source
                        </a>
                        <a className={secondaryLink} href="#top">
                            top ↑
                        </a>
                    </div>
                    <span>
                        <Heart />
                    </span>
                </footer>
            </div>
        </main>
    )
}
