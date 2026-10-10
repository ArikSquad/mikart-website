import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, Box, Code2, Film, Shield, Sparkles } from 'lucide-react'
import { CopyAddress } from '@/components/home/copy-address'
import './home.css'

export const metadata: Metadata = {
    title: 'MikArt — Minecraft server',
    description:
        'The MikArt Minecraft server is returning for Season 2. Take a look at the new world and save play.mikart.eu. Supports Minecraft 26.2.',
    openGraph: {
        title: 'MikArt — Minecraft server',
        description: 'MikArt is returning for Season 2. Minecraft 26.2 • play.mikart.eu.',
        url: 'https://www.mikart.eu',
        images: [{ url: '/assets/server/season-2-hall.png', width: 3258, height: 1358 }],
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MikArt — Minecraft server',
        images: ['/assets/server/season-2-hall.png']
    }
}

const projects = [
    {
        name: 'AnimVanish',
        type: 'MINECRAFT PLUGIN',
        description: 'Custom vanish animations for Minecraft servers.',
        href: '/docs/animvanish',
        icon: Sparkles
    },
    {
        name: 'GroupSecurity',
        type: 'MINECRAFT PLUGIN',
        description: 'Security and monitoring for Minecraft servers.',
        href: '/docs/gs',
        icon: Shield
    },
    {
        name: 'Panoptic',
        type: 'MINECRAFT PLUGIN',
        description: 'Configurable events for Minecraft servers.',
        href: '/docs/panoptic',
        icon: Box
    },
    {
        name: 'Tava',
        type: 'DEVELOPER TOOLKIT',
        description: 'A modular database toolkit for Java.',
        href: '/docs/tava',
        icon: Code2
    }
]

function Wordmark() {
    return <span className="wordmark">mikart</span>
}

export default function Home() {
    return (
        <div className="home" id="top">
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <header className="home-header">
                <div className="header-inner">
                    <Link href="/" aria-label="MikArt home">
                        <Wordmark />
                    </Link>
                    <nav aria-label="Main navigation">
                        <a href="#first-look">The server</a>
                        <Link href="/flow/discord">
                            Discord <ArrowUpRight size={13} aria-hidden="true" />
                        </Link>
                        <a className="projects-shortcut" href="#projects">
                            Our projects <ArrowDown size={12} aria-hidden="true" />
                        </a>
                    </nav>
                    <a className="header-play" href="#join">
                        JOIN SERVER <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                </div>
            </header>

            <main id="main" className="home-frame">
                <section className="hero" aria-labelledby="hero-title">
                    <div className="hero-copy">
                        <h1 id="hero-title">
                            YOUR NEXT
                            <br />
                            MINECRAFT
                            <br />
                            <span>ADVENTURE.</span>
                        </h1>
                        <p className="hero-description">
                            MikArt is returning for Season 2.
                            <br />
                            Bring your friends. Make yourself at home.
                        </p>
                        <CopyAddress />
                        <p className="connection-note">
                            Minecraft 26.2 <span>Click to copy the server address</span>
                        </p>
                    </div>
                    <div className="hero-art" aria-hidden="true">
                        <Image
                            src="/assets/server/season-2-forest.png"
                            fill
                            sizes="(max-width: 1050px) 100vw, 76vw"
                            alt=""
                            preload
                            className="hero-forest"
                        />
                    </div>
                    <div className="hero-bottom">
                        <Link href="/flow/discord">
                            Follow the relaunch on Discord <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                        <a href="#first-look">
                            Explore the server <ArrowDown size={16} aria-hidden="true" />
                        </a>
                    </div>
                </section>

                <section id="first-look" className="first-look section-space" aria-labelledby="first-look-title">
                    <div className="section-heading">
                        <div>
                            <h2 id="first-look-title">
                                TAKE A LOOK
                                <br />
                                AROUND.
                            </h2>
                        </div>
                        <p>
                            A first look at Season 2.
                            <br />
                            Captured in-game, while we build.
                        </p>
                    </div>
                    <figure className="trailer-frame">
                        <Image
                            src="/assets/server/season-2-hall.png"
                            alt="Lantern-lit stone corridors and hanging vines in MikArt’s Season 2 world"
                            fill
                            sizes="92vw"
                        />
                        <figcaption className="trailer-caption">
                            <span className="film-icon">
                                <Film size={26} strokeWidth={1.5} aria-hidden="true" />
                            </span>
                            <h3>Season 2 trailer</h3>
                            <p>Coming soon</p>
                        </figcaption>
                        <div className="trailer-bottom">
                            <span>Season 2 alpha · Subject to change</span>
                        </div>
                    </figure>
                </section>

                <section className="world-section section-space" aria-labelledby="world-title">
                    <figure className="world-image">
                        <Image
                            src="/assets/server/season-2-ruins.png"
                            alt="Moss-covered stone ruins and warm lantern light in the Season 2 alpha"
                            width={947}
                            height={637}
                            sizes="(max-width: 760px) 100vw, 50vw"
                        />
                    </figure>
                    <div className="world-copy">
                        <h2 id="world-title">
                            SEASON 2
                            <br />
                            <span>IS ON THE WAY.</span>
                        </h2>
                        <p>We’re working on the relaunch. These screenshots are a look inside the current build.</p>
                        <p>Join our Discord for development updates and the launch announcement.</p>
                        <Link className="text-link" href="/flow/discord">
                            Join our Discord <ArrowUpRight size={18} aria-hidden="true" />
                        </Link>
                    </div>
                </section>

                <section id="join" className="join-section section-space" aria-labelledby="join-title">
                    <div>
                        <h2 id="join-title">
                            JOIN THE
                            <br />
                            <span>SERVER.</span>
                        </h2>
                    </div>
                    <div className="join-instructions">
                        <p>
                            Open Minecraft <strong>26.2</strong>, head to <strong>Multiplayer</strong>, and add us to
                            your server list.
                        </p>
                        <CopyAddress />
                        <p className="join-footnote">
                            Season 2 is on its way.{' '}
                            <Link href="/flow/discord">
                                Get launch updates <ArrowUpRight size={12} aria-hidden="true" />
                            </Link>
                        </p>
                    </div>
                </section>

                <section id="projects" className="projects-section section-space" aria-labelledby="projects-title">
                    <div className="section-heading">
                        <div>
                            <h2 id="projects-title">
                                OUR
                                <br />
                                PROJECTS.
                            </h2>
                        </div>
                        <p>
                            Minecraft plugins and developer tools.
                            <br />
                            Made by the team behind MikArt.
                        </p>
                    </div>
                    <div className="project-list">
                        {projects.map(({ name, type, description, href, icon: Icon }) => (
                            <Link className="project-row" href={href} key={name}>
                                <span className="project-icon">
                                    <Icon size={23} strokeWidth={1.4} aria-hidden="true" />
                                </span>
                                <span className="project-name">
                                    {name}
                                    <span>{type}</span>
                                </span>
                                <span className="project-description">{description}</span>
                                <ArrowUpRight className="project-arrow" size={22} aria-hidden="true" />
                            </Link>
                        ))}
                    </div>
                    <a
                        className="text-link github-link"
                        href="https://github.com/ArikSquad"
                        target="_blank"
                        rel="noreferrer"
                    >
                        More on GitHub <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                </section>
            </main>

            <footer className="home-footer">
                <div className="footer-inner">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <Link href="/" aria-label="MikArt home">
                                <Wordmark />
                            </Link>
                            <a href="#join">
                                play.mikart.eu <ArrowUpRight size={18} aria-hidden="true" />
                            </a>
                        </div>
                        <nav aria-label="Server links">
                            <h2>Server</h2>
                            <a href="#join">How to join</a>
                            <Link href="/flow/discord">
                                Discord <ArrowUpRight size={13} aria-hidden="true" />
                            </Link>
                            <Link href="/docs/minecraft">Server guide</Link>
                            <Link href="/docs/minecraft/rules">Rules</Link>
                        </nav>
                        <nav aria-label="MikArt links">
                            <h2>MikArt</h2>
                            <a href="#projects">Our projects</a>
                            <Link href="/docs">Documentation</Link>
                            <Link href="/blog">Blog</Link>
                            <a href="https://github.com/ArikSquad" target="_blank" rel="noreferrer">
                                GitHub <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                        </nav>
                        <a className="back-top" href="#top">
                            Back to top <ArrowUpRight size={17} aria-hidden="true" />
                        </a>
                    </div>
                    <div className="footer-bottom">
                        <span>© MikArt Europe · Finland</span>
                        <span>Not affiliated with Mojang or Microsoft.</span>
                        <div>
                            <Link href="/privacy-policy">Privacy</Link>
                            <Link href="/terms-of-service">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
