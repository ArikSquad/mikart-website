'use client'

import Link from 'next/link'
import { SiGithub } from '@icons-pack/react-simple-icons'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { ease } from './home-data'
import { AsciiObject } from '@/components/ascii-object'

export function HeroSection({ reducedMotion }: { reducedMotion: boolean | null }) {
    return (
        <section className="hero-shell" id="top">
            <div className="hero-layout">
                <motion.div
                    className="hero-copy"
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease }}
                >
                    <h1>
                        I make
                        <br />
                        <em>complicated software</em>
                        <br />
                        easier to change.
                    </h1>
                    <p className="hero-lede">
                        I work on the part that usually gets expensive: typed data infrastructure, extensible game
                        platforms, security software, and the tools around communities.
                    </p>
                    <div className="hero-actions">
                        <Link className="button button-primary" href="/blog">
                            Blog <ArrowUpRight size={16} />
                        </Link>
                        <Link className="button button-quiet" href="https://github.com/ariksquad" target="_blank" rel="noreferrer">
                            GitHub <SiGithub size={15} />
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    className="hero-object-column"
                    initial={{ opacity: 0, scale: 0.94, rotate: 1 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.05, delay: 0.12, ease }}
                >
                    <div className="ascii-stage">
                        <AsciiObject
                            className="ascii-object"
                            src="/scene.gltf"
                            accent="#c6ff4f"
                            highlight="#5d7cff"
                            cellSize={8}
                            contrast={1.35}
                            autoRotate={reducedMotion !== true}
                            orbit
                            zoom
                            ariaLabel="ASCII-rendered 3D model"
                        />
                    </div>
                </motion.div>
            </div>

            <div className="hero-proofline">
                <span>Java / Rust / TypeScript / C++</span>
                <span>Finland / Europe</span>
                <Link href="#work">Work <ArrowUpRight size={15} /></Link>
            </div>
        </section>
    )
}
