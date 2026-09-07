import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { TechStackDialog } from './tech-stack-dialog'

const workCategories = [
    {
        name: 'security',
        projects: [
            {
                year: '2025',
                name: 'salattu',
                description: 'cross-platform password manager with a Rust core',
                href: 'https://salattu.mikart.eu',
                external: true
            }
        ]
    },
    {
        name: 'software & systems',
        projects: [
            { year: '2026', name: 'tava', description: 'typed data layer for Java', href: '/docs/tava' },
            {
                year: '2026',
                name: 'hypixel recreation',
                description: 'extensible Minecraft platform and shared systems',
                href: 'https://github.com/Swofty-Developments/HypixelRecreation',
                external: true
            }
        ]
    },
    {
        name: 'products & platforms',
        projects: [
            {
                year: '2025',
                name: 'ensave',
                description: 'community operations, made repeatable',
                href: 'https://ensave.mikart.eu',
                external: true
            },
            { year: '2025', name: 'mikart docs', description: 'APIs, setup, and technical decisions', href: '/docs' }
        ]
    }
] as const

const secondaryLink =
    'border-b border-[#343330] pb-1 text-[#97938c] transition-colors hover:border-[#e4e2de] hover:text-[#e4e2de] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#97938c]'

export function PortfolioPage() {
    return (
        <main id="top" className="min-h-svh bg-[#111111] font-mono text-sm tracking-[-0.015em] text-[#e4e2de]">
            <div className="mx-auto flex min-h-svh w-full max-w-[808px] flex-col px-4 pt-[clamp(4.75rem,15vh,9.875rem)] pb-8 sm:px-6">
                <header className="flex items-start justify-between gap-6 sm:gap-8">
                    <div>
                        <p className="m-0 text-base leading-none font-bold">ari</p>
                        <p className="mt-2.5 mb-0 leading-tight text-[#97938c]">software engineer — finland</p>
                    </div>
                    <div className="flex items-baseline gap-3 sm:gap-5">
                        <TechStackDialog />
                        <Link className={`${secondaryLink} text-xs`} href="/blog" transitionTypes={['nav-forward']}>
                            blog
                        </Link>
                    </div>
                </header>

                <section className="mt-[clamp(5.25rem,11vh,7.875rem)] max-w-[620px]" aria-labelledby="intro-title">
                    <h1 id="intro-title" className="sr-only">
                        Ari, software engineer in Finland
                    </h1>
                    <p className="m-0 text-[clamp(0.875rem,1.55vw,1rem)] leading-[1.62]">
                        I build <strong className="font-bold">reliable software and secure systems</strong>: typed
                        infrastructure, developer tools, and products designed to remain understandable as they grow.
                        Based in Finland and currently engineering at{' '}
                        <a className={secondaryLink} href="https://www.mikart.eu" target="_blank" rel="noreferrer">
                            mikart europe
                        </a>
                        .
                    </p>
                </section>

                <section className="mt-[clamp(4.875rem,10vh,7.25rem)]" id="work" aria-labelledby="work-title">
                    <p id="work-title" className="m-0 text-[#97938c]">
                        selected work
                    </p>
                    {workCategories.map((category) => (
                        <div className="mt-8" key={category.name}>
                            <h2 className="m-0 text-[11px] leading-none font-medium tracking-[0.08em] text-[#97938c] uppercase">
                                {category.name}
                            </h2>
                            <div className="mt-2.5">
                                {category.projects.map((work) => (
                                    <Link
                                        key={work.name}
                                        className="group grid grid-cols-[42px_minmax(0,1fr)_14px] items-baseline gap-x-2.5 py-2 leading-[1.4] text-[#97938c] transition-colors hover:text-[#e4e2de] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#97938c] sm:grid-cols-[48px_minmax(110px,.48fr)_minmax(0,1fr)_14px] sm:gap-x-3"
                                        href={work.href}
                                        target={'external' in work && work.external ? '_blank' : undefined}
                                        rel={'external' in work && work.external ? 'noreferrer' : undefined}
                                        transitionTypes={
                                            !('external' in work && work.external) ? ['nav-forward'] : undefined
                                        }
                                    >
                                        <span className="text-xs text-[#6e6b66]">{work.year}</span>
                                        <strong className="truncate font-medium text-[#e4e2de] group-hover:text-white">
                                            {work.name}
                                        </strong>
                                        <span className="col-start-2 text-xs leading-[1.45] sm:col-auto sm:text-sm">
                                            {work.description}
                                        </span>
                                        <ArrowUpRight
                                            className="col-start-3 row-start-1 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100 sm:col-start-4"
                                            aria-hidden="true"
                                            size={13}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                <section className="mt-[clamp(5.125rem,11vh,8.25rem)]" aria-labelledby="focus-title">
                    <p id="focus-title" className="m-0 text-[#97938c]">
                        current focus
                    </p>
                    <div className="mt-6 grid gap-x-6 gap-y-2.5 border-t border-[#343330] pt-4 max-[440px]:block sm:grid-cols-[minmax(140px,.34fr)_minmax(0,1fr)]">
                        <h2 className="m-0 font-medium">security practice</h2>
                        <p className="m-0 leading-[1.6] text-[#97938c] max-[440px]:mt-3">
                            Documenting hands-on security work alongside software projects. Technical notes and case
                            studies are in progress.
                        </p>
                        <span className="col-start-2 text-[11px] leading-normal text-[#706d68] max-[440px]:mt-3 max-[440px]:block">
                            network analysis / secure systems / Linux
                        </span>
                    </div>
                </section>

                <section className="mt-[clamp(5.125rem,11vh,8.25rem)]" aria-labelledby="elsewhere-title">
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
                    <span>Finland / Europe</span>
                </footer>
            </div>
        </main>
    )
}
