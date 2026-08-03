'use client'

import { ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { ease } from './home-data'

export function HeroSection({ time }: { time: string; reducedMotion: boolean | null }) {
    return (
        <section
            className="relative min-h-svh overflow-hidden bg-[#20182f] px-[clamp(18px,2.8vw,54px)] text-[#e9e4da]"
            id="top"
        >
            <motion.h1
                className="absolute top-[31%] right-[4%] left-[4%] m-0 text-center text-[clamp(52px,7.25vw,140px)] leading-[.77] font-semibold tracking-[-.075em] uppercase [&>span]:block [&>span]:whitespace-nowrap [&_em]:font-[var(--font-editorial),Georgia,serif] [&_em]:font-semibold [&_em]:tracking-[-.055em] [&_em]:text-[#a88ce8] max-sm:top-[27%] max-sm:right-[2%] max-sm:left-[2%] max-sm:text-[clamp(39px,12.1vw,68px)] max-sm:leading-[.82] max-sm:[&>span]:whitespace-normal"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease }}
            >
                <span>
                    <em>Building</em> software
                </span>
                <span>
                    that <em>scale</em> in the
                </span>
                <span>
                    <em>real world</em>.
                </span>
            </motion.h1>
            <div
                className="absolute bottom-6 left-[clamp(18px,2.8vw,54px)] text-[clamp(15px,1.4vw,22px)] font-extrabold tracking-[-.04em] text-[#a88ce8] max-sm:left-[18px]"
                aria-label="ArikSquad"
            >
                ARIKSQUAD <i className="align-top text-[.45em]">®</i>
            </div>
            <div className="absolute right-5 bottom-[18px] z-[5] text-[#e9e4da] max-sm:right-[18px] max-sm:bottom-[22px]">
                <span className="flex flex-col items-end gap-0.5">
                    <small className="font-mono text-[7px] leading-none font-medium tracking-[.08em] uppercase text-[#e9e4da]/55">
                        Local time // Finland
                    </small>
                    <strong className="font-mono text-[clamp(23px,2.8vw,40px)] leading-[.9] font-extrabold tracking-[-.08em]">
                        {time}
                    </strong>
                </span>
            </div>
            <a
                className="absolute top-[46%] right-[3.2vw] z-[4] flex origin-right translate-x-1/2 rotate-90 items-center gap-4 text-[10px] font-extrabold tracking-[.12em] uppercase max-sm:hidden"
                href="#story"
            >
                <span>Scroll to explore</span>
                <ArrowDown className="w-[18px]" />
            </a>
        </section>
    )
}
