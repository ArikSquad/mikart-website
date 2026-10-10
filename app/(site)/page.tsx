import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'

export const metadata: Metadata = {
    title: 'MikArt Europe — Coming soon',
    description: 'Something new is taking shape. Explore MikArt Europe documentation, projects, and blog.',
    openGraph: {
        title: 'MikArt Europe — Coming soon',
        description: 'Something new is taking shape.',
        url: 'https://www.mikart.eu',
        type: 'website'
    },
    twitter: {
        card: 'summary',
        title: 'MikArt Europe — Coming soon',
        description: 'Something new is taking shape.'
    }
}

const links = [
    { name: 'Documentation', detail: 'Explore the tools', href: '/docs' },
    { name: 'GitHub', detail: 'Follow the work', href: 'https://github.com/ArikSquad' },
    { name: 'Blog', detail: 'Notes & updates', href: '/blog' }
]

export default function Home() {
    return (
        <PageTransition>
            <main className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#111111] px-6 font-mono text-[#e4e2de] sm:px-12">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_30%,#253029_0%,transparent_55%)]"
                />
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 border-b border-white/10 py-8 text-xs">
                    <span className="font-semibold tracking-tight">
                        mikart europe<span className="text-[#b6cba7]"> /</span>
                    </span>
                    <span className="text-[#97938c]">software & ideas</span>
                </header>
                <section
                    className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center py-20 sm:py-28"
                    aria-labelledby="coming-soon-title"
                >
                    <p className="mb-8 flex items-center gap-3 text-[10px] tracking-[0.18em] text-[#b6cba7] uppercase">
                        <span className="size-1.5 rounded-full bg-[#b6cba7]" aria-hidden="true" /> A new chapter
                    </p>
                    <h1
                        id="coming-soon-title"
                        className="text-[clamp(3.5rem,10vw,9rem)] leading-[0.95] font-medium tracking-[-0.075em]"
                    >
                        Coming
                        <br />
                        <span className="text-[#b6cba7]">soon.</span>
                    </h1>
                    <p className="mt-10 max-w-md text-sm leading-7 text-[#97938c]">
                        Something new is taking shape.
                        <br />
                        In the meantime, here’s where to find us.
                    </p>
                    <nav
                        aria-label="Explore MikArt Europe"
                        className="mt-14 grid max-w-3xl grid-cols-1 border-t border-white/15 sm:grid-cols-3"
                    >
                        {links.map((link, index) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                target={link.href.startsWith('https:') ? '_blank' : undefined}
                                rel={link.href.startsWith('https:') ? 'noreferrer' : undefined}
                                className="group flex items-start justify-between gap-6 border-b border-white/15 py-6 transition-colors hover:text-[#b6cba7] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#b6cba7] sm:pr-8"
                            >
                                <span>
                                    <span className="mb-4 block text-[10px] text-[#686d65]">0{index + 1}</span>
                                    <span className="block text-sm">{link.name}</span>
                                    <span className="mt-2 block text-[11px] text-[#97938c]">{link.detail}</span>
                                </span>
                                <ArrowUpRight
                                    size={16}
                                    aria-hidden="true"
                                    className="mt-7 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </Link>
                        ))}
                    </nav>
                </section>
                <footer className="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-4 border-t border-white/10 py-7 text-[10px] tracking-wide text-[#97938c]">
                    <span>MikArt Europe</span>
                    <span>Built with intention. Based in Finland.</span>
                </footer>
            </main>
        </PageTransition>
    )
}
