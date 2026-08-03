'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
    ArrowUpRight,
    BookOpen,
    Braces,
    Check,
    Code2,
    Database,
    FileText,
    Mail,
    Sparkles,
    Terminal
} from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ease, helsinkiTime, projects, socials } from './home-data'
import { HeroSection } from './hero-section'
import { RevealOnScroll } from './reveal'
import { SiteNavigation } from './site-navigation'

export function PortfolioPage() {
    const [time, setTime] = useState(helsinkiTime)
    const [menuOpen, setMenuOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const prefersReducedMotion = useReducedMotion()
    const storyRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll()
    const { scrollYProgress: storyProgress } = useScroll({
        target: storyRef,
        offset: ['start start', 'end end']
    })
    const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.25 })
    const lineOneX = useTransform(storyProgress, [0, 1], ['10vw', '-32vw'])
    const lineTwoX = useTransform(storyProgress, [0, 1], ['-34vw', '8vw'])
    const blobRotate = useTransform(storyProgress, [0, 1], [-8, 18])
    const blobScale = useTransform(storyProgress, [0, 0.55, 1], [0.82, 1.04, 0.9])
    const storyColor = useTransform(storyProgress, [0, 0.48, 1], ['#101b36', '#173d37', '#d95332'])
    const storyCount = useTransform(storyProgress, (value) => Math.round(value * 99 + 1))

    useEffect(() => {
        const update = () => {
            setTime(helsinkiTime())
        }
        update()
        const timer = window.setInterval(update, 30_000)
        return () => window.clearInterval(timer)
    }, [])

    const copyEmail = async () => {
        const email = 'ariksquad@mikart.eu'
        try {
            await navigator.clipboard.writeText(email)
        } catch {
            const fallback = document.createElement('textarea')
            fallback.value = email
            fallback.style.position = 'fixed'
            fallback.style.opacity = '0'
            document.body.appendChild(fallback)
            fallback.select()
            document.execCommand('copy')
            fallback.remove()
        }
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
    }

    return (
        <main className="portfolio min-h-screen overflow-clip bg-[#20182f] font-sans text-[#e9e4da] [--cream:#e9e4da] [--paper:#dcd5c9] [--ink:#20182f] [--orange:#a88ce8] [--blue:#8d75d0] [--green:#819b82] [--yellow:#d7c6ff]">
            <motion.div
                className="fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-[#b49af1]"
                style={{ scaleX: progress }}
                aria-hidden="true"
            />

            <SiteNavigation
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                time={time}
                reducedMotion={prefersReducedMotion}
            />
            <HeroSection time={time} reducedMotion={prefersReducedMotion} />

            <section className="story" id="story" ref={storyRef}>
                <motion.div className="story-sticky" style={{ backgroundColor: storyColor }}>
                    <motion.div
                        className="story-blob"
                        style={{ rotate: blobRotate, scale: blobScale }}
                        aria-hidden="true"
                    />
                    <div className="story-copy">
                        <motion.p style={{ x: lineOneX }}>BUILD FOR CLARITY&nbsp;—&nbsp;BUILD FOR CLARITY</motion.p>
                        <motion.p className="story-outline" style={{ x: lineTwoX }}>
                            SHIP WITH CHARACTER&nbsp;—&nbsp;SHIP WITH CHARACTER
                        </motion.p>
                    </div>
                    <div className="story-note">
                        <Braces size={24} />
                        <p>
                            types where they help.
                            <br />
                            taste everywhere else.
                        </p>
                    </div>
                    <div className="story-count">
                        <span>you're almost there</span>
                        <motion.b>{storyCount}</motion.b>
                        <i>%</i>
                    </div>
                </motion.div>
            </section>

            <section className="work" id="work">
                <div className="work-heading">
                    <RevealOnScroll>
                        <h2>
                            Selected
                            <br />
                            <em>systems.</em>
                        </h2>
                    </RevealOnScroll>
                    <p>
                        Four different problems. One standard: the thing should feel good and keep working after deploy.
                    </p>
                </div>

                <div className="project-list">
                    {projects.map((project, index) => (
                        <Project key={project.name} project={project} offset={index % 2 === 1} />
                    ))}
                </div>
            </section>

            <section className="principles" id="principles">
                <RevealOnScroll>
                    <h2>
                        make it
                        <br />
                        <i>useful.</i>
                    </h2>
                </RevealOnScroll>
                <div className="principle-copy">
                    <p>
                        interfaces should explain themselves. architecture should earn its complexity. production should
                        be pleasantly boring.
                    </p>
                    <div className="principle-tags">
                        <span>
                            <b>01</b> type-safe
                        </span>
                        <span>
                            <b>02</b> observable
                        </span>
                        <span>
                            <b>03</b> human-scale
                        </span>
                        <span>
                            <b>04</b> shippable
                        </span>
                    </div>
                </div>
                <motion.div
                    className="principles-stamp"
                    whileHover={prefersReducedMotion ? undefined : { rotate: 8, scale: 1.06 }}
                >
                    <Code2 />
                    <span>
                        SHIP
                        <br />
                        CLEAN
                    </span>
                </motion.div>
            </section>

            <section className="routes" aria-label="Explore more">
                <Link href="/blog">
                    <span>
                        <FileText />
                    </span>
                    <small>Notes from the workbench</small>
                    <strong>read the blog</strong>
                    <ArrowUpRight />
                </Link>
                <Link href="/docs">
                    <span>
                        <BookOpen />
                    </span>
                    <small>APIs, setup, and decisions</small>
                    <strong>open the docs</strong>
                    <ArrowUpRight />
                </Link>
            </section>

            <footer className="footer" id="hello">
                <div className="footer-top">
                    <div className="footer-title">
                        <h2>
                            MAKE SOMETHING
                            <br />
                            <i>THAT LASTS.</i>
                        </h2>
                    </div>
                    <motion.button
                        className={`footer-contact ${copied ? 'is-copied' : ''}`}
                        onClick={copyEmail}
                        aria-label="Copy email address"
                        animate={
                            copied ? { rotate: [0, -7, 6, 0], scale: [1, 0.86, 1.1, 1] } : { rotate: -4, scale: 1 }
                        }
                        whileHover={prefersReducedMotion ? undefined : { rotate: 2, scale: 1.04 }}
                        transition={{ duration: copied ? 0.65 : 0.35, ease }}
                    >
                        <span className="contact-burst" aria-hidden="true" />
                        <Mail />
                        <span>{copied ? 'Copied — say hello' : 'Start a conversation'}</span>
                    </motion.button>
                </div>
                <div className="footer-directory">
                    <div className="footer-nav">
                        <small>Find your way</small>
                        <Link href="#work">Selected work</Link>
                        <Link href="/blog">Field notes</Link>
                        <Link href="/docs">Documentation</Link>
                        <a href="#top">Back to the top</a>
                    </div>
                    <div className="socials">
                        <small>Elsewhere</small>
                        {socials.map((social) => (
                            <Link
                                key={social.label}
                                href={social.href}
                                target={social.href.startsWith('http') ? '_blank' : undefined}
                                rel="noreferrer"
                            >
                                <social.icon />
                                <span>
                                    <strong>{social.label}</strong>
                                    <small>{social.handle}</small>
                                </span>
                                <ArrowUpRight />
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} ArikSquad / MikArt Europe</span>
                    <span>Code, character, and careful edges.</span>
                </div>
            </footer>

            {copied && (
                <motion.div className="copy-toast" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <Check /> Email copied
                </motion.div>
            )}
        </main>
    )
}

function Project({ project, offset }: { project: (typeof projects)[number]; offset: boolean }) {
    return (
        <motion.article
            className={`project project-${project.theme} ${offset ? 'project-offset' : ''}`}
            whileInView={{ clipPath: 'inset(0% 0 0% 0 round 36px)' }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1, ease }}
        >
            <div className="project-index">{project.index}</div>
            <div className="project-copy">
                <p>{project.name}</p>
                <h3>{project.strap}</h3>
                <span>{project.detail}</span>
                <div>
                    {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                    ))}
                </div>
                <Link
                    href={project.href}
                    target={project.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                >
                    {project.link}
                    <ArrowUpRight />
                </Link>
            </div>
            <div className="project-art">
                {project.image ? (
                    <Image
                        src={project.image}
                        alt={`${project.name} preview`}
                        fill
                        sizes="(max-width: 800px) 90vw, 52vw"
                    />
                ) : (
                    <TavaArt />
                )}
            </div>
        </motion.article>
    )
}

function TavaArt() {
    return (
        <div className="tava-art" aria-label="Tava database toolkit illustration">
            <div className="tava-window">
                <div className="tava-window-bar">
                    <span />
                    <span />
                    <span />
                    <small>Repository.java</small>
                </div>
                <pre>
                    <b>record</b> User(<i>UUID</i> id, <i>String</i> name) {'{}'}
                    {`\n\n`}
                    <b>var</b> users = tava.table(User.class);{`\n`}users.find(where(User::id).is(userId));
                </pre>
            </div>
            <div className="tava-flow">
                <span>
                    <Braces /> MODEL
                </span>
                <i>→</i>
                <span>
                    <Terminal /> ADAPTER
                </span>
                <i>→</i>
                <span>
                    <Database /> DATA
                </span>
            </div>
            <div className="tava-caption">
                <strong>ONE MODEL.</strong>
                <small>HONEST CAPABILITIES.</small>
            </div>
        </div>
    )
}
