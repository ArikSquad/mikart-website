'use client'

import Link from 'next/link'
import { ArrowUpRight, FileText, Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { ease } from './home-data'

export function SiteNavigation({
    menuOpen,
    setMenuOpen,
    time,
    reducedMotion
}: {
    menuOpen: boolean
    setMenuOpen: (open: boolean) => void
    time: string
    reducedMotion: boolean | null
}) {
    return (
        <>
            <header className="absolute top-[30px] right-[clamp(26px,4vw,68px)] left-[clamp(26px,4vw,68px)] z-30 flex items-center justify-between text-[#e9e4da] max-sm:top-[25px] max-sm:right-6 max-sm:left-6">
                <Link
                    href="/"
                    className="flex items-baseline font-sans text-[clamp(20px,2vw,30px)] font-extrabold tracking-[-.07em]"
                >
                    <strong>MikArt</strong>
                    <span className="pl-[.12em] text-[#ab8dea]">Europe.</span>
                </Link>
                <nav className="ml-auto flex items-center gap-6" aria-label="Primary navigation">
                    <Link
                        href="/blog"
                        className="group flex cursor-pointer items-center gap-3.75 border-0 bg-transparent p-0 text-xs font-bold tracking-widest uppercase"
                        aria-label="Read the blog"
                    >
                        <span className="max-sm:hidden">Blog</span>
                    </Link>
                    <button
                        className="group flex cursor-pointer items-center gap-3.75 border-0 bg-transparent p-0 text-xs font-bold tracking-widest uppercase"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <span className="max-sm:hidden">Explore</span>
                        <Menu />
                    </button>
                </nav>
            </header>
            <motion.div
                className="fixed inset-0 z-90 grid grid-rows-[1fr_auto] bg-[#20182f] px-[5vw] pt-[clamp(70px,9vw,130px)] pb-9 text-[#e9e4da] max-sm:px-5 max-sm:pt-20 max-sm:pb-6"
                initial={false}
                animate={{ clipPath: menuOpen ? 'circle(145% at 94% 5%)' : 'circle(0% at 94% 5%)' }}
                transition={{ duration: reducedMotion ? 0 : 0.8, ease }}
                aria-hidden={!menuOpen}
                inert={!menuOpen}
            >
                <button
                    className="absolute top-7 right-[3.2vw] grid size-12 cursor-pointer place-items-center rounded-full border border-white/40 bg-transparent max-sm:right-5"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <X size={22} />
                </button>
                <nav className="flex flex-col justify-center" aria-label="Section navigation">
                    {[
                        ['01', 'Work', '#work'],
                        ['02', 'Principles', '#principles'],
                        ['03', 'Writing', '/blog'],
                        ['04', 'Documentation', '/docs'],
                        ['05', 'Hello', '#hello']
                    ].map(([number, label, href]) => (
                        <Link
                            className="group grid grid-cols-[55px_1fr_auto] items-center border-b border-white/15 py-[9px] text-[clamp(42px,7.2vw,108px)] leading-[.95] font-extrabold tracking-[-.065em] max-sm:grid-cols-[32px_1fr_auto] max-sm:py-3.5 max-sm:text-[45px]"
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                        >
                            <small className="mt-[.7em] self-start text-[11px] tracking-[.12em] text-[#9fabc4] max-sm:mt-[.45em]">
                                {number}
                            </small>
                            {label}
                            <ArrowUpRight className="h-auto w-[clamp(28px,4vw,60px)] transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" />
                        </Link>
                    ))}
                </nav>
                <div className="flex justify-between pt-6 text-[11px] tracking-[.12em] uppercase">
                    <span>Finland / {time}</span>
                    <span className="max-sm:hidden">UTC +03 right now</span>
                </div>
            </motion.div>
        </>
    )
}
