'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
    ArrowUpRight,
    Braces,
    Check,
    Database,
    GitBranch,
    Layers3,
    Mail,
    ShieldCheck,
    Terminal,
    Workflow
} from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { capabilities, ease, helsinkiTime, projects, proofPoints, socials, type ProjectData } from './home-data'
import { HeroSection } from './hero-section'
import { RevealOnScroll } from './reveal'
import { SiteNavigation } from './site-navigation'

export function PortfolioPage() {
    const [time, setTime] = useState(helsinkiTime)
    const [menuOpen, setMenuOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [activeProject, setActiveProject] = useState(0)
    const prefersReducedMotion = useReducedMotion()
    const thresholdRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll()
    const { scrollYProgress: thresholdProgress } = useScroll({
        target: thresholdRef,
        offset: ['start start', 'end end']
    })
    const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.25 })
    const thresholdLineTargetX = useTransform(thresholdProgress, [0, 1], ['0vw', '-5vw'])
    const thresholdLineX = useSpring(thresholdLineTargetX, { stiffness: 110, damping: 30, mass: 0.35 })
    const thresholdColor = useTransform(thresholdProgress, [0, 0.5, 1], ['#151914', '#1d221b', '#202334'])

    useEffect(() => {
        const update = () => setTime(helsinkiTime())
        update()
        const timer = window.setInterval(update, 30_000)
        return () => window.clearInterval(timer)
    }, [])

    async function copyEmail() {
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

    const currentProject = projects[activeProject]

    return (
        <main className="portfolio">
            <motion.div className="page-progress" style={{ scaleX: progress }} aria-hidden="true" />
            <SiteNavigation
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                time={time}
                reducedMotion={prefersReducedMotion}
            />
            <HeroSection reducedMotion={prefersReducedMotion} />

            <div className="signal-strip" aria-label="Areas of practice">
                <div>
                    {['Data infrastructure', 'Game platforms', 'Security software', 'Community tools'].map((item) => (
                        <span key={item}>{item}</span>
                    ))}
                </div>
            </div>

            <section className="about-section" id="about">
                <div className="about-grid">
                    <RevealOnScroll>
                        <h2>
                            most of my work happens where software gets <em>complicated.</em>
                        </h2>
                    </RevealOnScroll>
                    <div className="about-copy">
                        <p>
                            I like the places where feature implementation turns into a question about boundaries,
                            scale, operators, or trust. That has led me from Java infrastructure and Minecraft platforms
                            to Rust experiments, security products, and web tools people actually have to live with.
                        </p>
                        <Link
                            className="underlined-link"
                            href="https://github.com/ariksquad"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Browse the open source trail <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
                <div className="proof-grid">
                    {proofPoints.map((point) => (
                        <div className="proof-card" key={point.label}>
                            <strong>{point.value}</strong>
                            <span>{point.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="threshold" id="approach" ref={thresholdRef}>
                <motion.div className="threshold-sticky" style={{ backgroundColor: thresholdColor }}>
                    <motion.p className="threshold-line" style={{ x: thresholdLineX }}>
                        The next person should not have to guess
                    </motion.p>
                    <div className="threshold-copy">
                        <h2>the version someone else inherits matters.</h2>
                        <p>
                            I care about the hour after I leave the room: when somebody else has to understand the
                            model, find the edge, and make the next change.
                        </p>
                    </div>
                    <div className="threshold-aside">
                        <p>
                            Good software does not need to explain itself loudly. It needs to leave fewer mysteries
                            behind.
                        </p>
                    </div>
                </motion.div>
            </section>

            <section className="work-section" id="work">
                <div className="work-heading">
                    <RevealOnScroll>
                        <h2>
                            things I
                            <br />
                            <em>built.</em>
                        </h2>
                    </RevealOnScroll>
                    <p>These are the kinds of problems I keep returning to. Pick one if you want the details.</p>
                </div>

                <div className="project-browser">
                    <div className="project-tabs" role="tablist" aria-label="Projects">
                        {projects.map((project, index) => (
                            <button
                                key={project.name}
                                type="button"
                                role="tab"
                                aria-selected={activeProject === index}
                                className={activeProject === index ? 'is-active' : ''}
                                onClick={() => setActiveProject(index)}
                            >
                                <span>{project.index}</span>
                                <strong>{project.name}</strong>
                                <small>{project.category}</small>
                                <ArrowUpRight size={17} />
                            </button>
                        ))}
                    </div>

                    <motion.article
                        className={`project-panel project-panel-${currentProject.theme}`}
                        key={currentProject.name}
                        role="tabpanel"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease }}
                    >
                        <div className="project-panel-copy">
                            <h3>{currentProject.strap}</h3>
                            <p>{currentProject.detail}</p>
                            <div className="project-outcome">
                                <span>What changed</span>
                                <strong>{currentProject.outcome}</strong>
                            </div>
                            <div className="project-tags">
                                {currentProject.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                            <Link
                                className="button button-panel"
                                href={currentProject.href}
                                target={currentProject.href.startsWith('http') ? '_blank' : undefined}
                                rel="noreferrer"
                            >
                                {currentProject.link} <ArrowUpRight size={16} />
                            </Link>
                        </div>
                        <div className="project-panel-visual">
                            <ProjectVisual project={currentProject} />
                        </div>
                    </motion.article>
                </div>
            </section>

            <section className="practice-section" id="principles">
                <div className="practice-heading">
                    <h2>
                        built for <em>change.</em>
                    </h2>
                    <p>
                        The feature is only the beginning. The real craft is in making the system legible to its next
                        maintainer, its operator, and the person who has never seen the code before.
                    </p>
                </div>
                <div className="capability-grid">
                    {capabilities.map((capability) => (
                        <RevealOnScroll className="capability-card" key={capability.number}>
                            <h3>{capability.title}</h3>
                            <p>{capability.copy}</p>
                        </RevealOnScroll>
                    ))}
                </div>
                <div className="practice-footnote">
                    <span>
                        <ShieldCheck size={16} /> reliable by default
                    </span>
                    <span>
                        <Workflow size={16} /> designed for change
                    </span>
                    <span>
                        <Layers3 size={16} /> systems over symptoms
                    </span>
                </div>
            </section>

            <section className="routes-section" aria-label="Explore more">
                <Link href="/blog" className="route-card route-card-blue" transitionTypes={['nav-forward']}>
                    <span className="route-icon">
                        <Terminal size={20} />
                    </span>
                    <small>Field notes from the workbench</small>
                    <strong>read the notes.</strong>
                    <ArrowUpRight />
                </Link>
                <Link href="/docs" className="route-card route-card-lime" transitionTypes={['nav-forward']}>
                    <span className="route-icon">
                        <Database size={20} />
                    </span>
                    <small>APIs, setup, and decisions</small>
                    <strong>project docs.</strong>
                    <ArrowUpRight />
                </Link>
            </section>

            <section className="contact-section" id="hello">
                <div className="contact-content">
                    <div>
                        <h2>
                            Have a problem
                            <br />
                            <em>worth solving?</em>
                        </h2>
                        <p>
                            Tell me what is breaking, what is growing, or what should exist next. I am usually most
                            useful somewhere in the middle of it.
                        </p>
                    </div>
                    <motion.button
                        type="button"
                        className={`contact-button ${copied ? 'is-copied' : ''}`}
                        onClick={copyEmail}
                        whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                    >
                        <Mail className="text-white" size={31} />
                        <span className="text-white">{copied ? 'Copied' : 'Start a conversation'}</span>
                    </motion.button>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-topline">
                    <span>ArikSquad / MikArt Europe</span>
                    <span>Finland / Europe</span>
                </div>
                <div className="footer-main">
                    <div className="footer-title">
                        <h2>
                            make useful
                            <br />
                            <em>things.</em>
                        </h2>
                    </div>
                    <div className="footer-nav">
                        <small>Navigate</small>
                        <Link href="#work">Work</Link>
                        <Link href="#about">About</Link>
                        <Link href="/blog" transitionTypes={['nav-forward']}>
                            Notes
                        </Link>
                        <Link href="/docs" transitionTypes={['nav-forward']}>
                            Docs
                        </Link>
                    </div>
                </div>
                <div className="footer-socials">
                    {socials.map((social) => (
                        <Link
                            key={social.label}
                            href={social.href}
                            target={social.href.startsWith('http') ? '_blank' : undefined}
                            rel="noreferrer"
                        >
                            <social.icon />
                            <span>{social.label}</span>
                            <ArrowUpRight size={14} />
                        </Link>
                    ))}
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} ArikSquad / MikArt Europe</span>
                    <span>Finland / {time}</span>
                    <a href="#top">Back to top ↑</a>
                </div>
            </footer>

            {copied && (
                <motion.div className="copy-toast" initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <Check size={15} /> Email copied
                </motion.div>
            )}
        </main>
    )
}

function ProjectVisual({ project }: { project: ProjectData }) {
    if (project.visual === 'image' && project.image) {
        return (
            <div className="visual-image">
                <Image
                    src={project.image}
                    alt={`${project.name} product preview`}
                    fill
                    sizes="(max-width: 850px) 94vw, 56vw"
                />
            </div>
        )
    }
    if (project.visual === 'platform') return <PlatformArt />
    if (project.visual === 'terminal') return <TerminalArt />
    return <TavaArt />
}

function TavaArt() {
    return (
        <div className="tava-visual">
            <div className="tava-window">
                <div className="window-bar">
                    <span />
                    <span />
                    <span />
                    <small>Repository.java</small>
                </div>
                <pre>
                    <b>record</b> User(<i>UUID</i> id, <i>String</i> name) {'{}'}
                    {'\n\n'}
                    <b>var</b> users = tava.table(User.class);{'\n'}
                    users.find(where(User::id).is(userId));
                </pre>
            </div>
            <div className="tava-flow">
                <span>
                    <Braces size={14} /> Model
                </span>
                <i>→</i>
                <span>
                    <GitBranch size={14} /> Adapter
                </span>
                <i>→</i>
                <span>
                    <Database size={14} /> Data
                </span>
            </div>
            <div className="tava-stamp">
                <strong>One model.</strong>
                <small>Honest capabilities.</small>
            </div>
        </div>
    )
}

function PlatformArt() {
    return (
        <div className="platform-visual" role="img" aria-label="Shared platform layers">
            <div className="platform-index">02</div>
            <div className="platform-caption">one core / separate modes</div>
            <div className="platform-stack" aria-hidden="true">
                <div>
                    <span>world</span>
                    <i />
                </div>
                <div>
                    <span>game modes</span>
                    <i />
                </div>
                <div>
                    <span>shared systems</span>
                    <i />
                </div>
            </div>
        </div>
    )
}

function TerminalArt() {
    return (
        <div className="terminal-visual">
            <div className="terminal-top">
                <span>runtime / secure</span>
                <i />
            </div>
            <div className="terminal-lines">
                <p>
                    <b>01</b> checking boundary <strong>ok</strong>
                </p>
                <p>
                    <b>02</b> loading policy engine <strong>ok</strong>
                </p>
                <p>
                    <b>03</b> opening operator surface <strong>ok</strong>
                </p>
            </div>
            <div className="terminal-big">
                SHIP
                <br />
                <em>THE FIX</em>
            </div>
            <Terminal className="terminal-icon" />
        </div>
    )
}
