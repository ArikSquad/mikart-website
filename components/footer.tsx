import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SiX, SiYoutube, SiDiscord, SiGithub } from '@icons-pack/react-simple-icons'
import { Mail, MapPin, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const footerSections = [
    {
        title: 'Services',
        links: [
            {
                name: 'AnimVanish',
                link: '/docs/animvanish/',
                description: 'Simple vanish animations'
            },
            {
                name: 'GroupSecurity',
                link: '/docs/gs/',
                description: 'Security solutions'
            },
            {
                name: 'Panoptic',
                link: '/docs/panoptic/',
                description: 'Monitoring system'
            }
        ]
    },
    {
        title: 'Resources',
        links: [
            {
                name: 'Documentation',
                link: '/docs/',
                description: 'Complete guides'
            },
            {
                name: 'Blog',
                link: '/blog/',
                description: 'Latest updates'
            }
        ]
    },
    {
        title: 'Legal',
        links: [
            {
                name: 'Terms of Service',
                link: '/terms-of-service/',
                description: 'Usage terms'
            },
            {
                name: 'Privacy Policy',
                link: '/privacy-policy/',
                description: 'Data protection'
            }
        ]
    }
]

const socialLinks = [
    {
        name: 'X (Twitter)',
        icon: SiX,
        link: 'https://www.x.com/ArikSquad',
        color: 'hover:text-gray-400'
    },
    {
        name: 'YouTube',
        icon: SiYoutube,
        link: 'https://www.youtube.com/@ArikSquad',
        color: 'hover:text-red-500'
    },
    {
        name: 'Discord',
        icon: SiDiscord,
        link: '/flow/discord',
        color: 'hover:text-blue-500'
    },
    {
        name: 'GitHub',
        icon: SiGithub,
        link: 'https://github.com/MikArt-Europe/website',
        color: 'hover:text-gray-400'
    }
]

const contactInfo = [
    {
        icon: Mail,
        text: 'ariksquad@mikart.eu',
        link: 'mailto:ariksquad@mikart.eu'
    },
    {
        icon: MapPin,
        text: 'Europe',
        link: null
    },
    {
        icon: Clock,
        text: 'UTC+2',
        link: null
    }
]

export default function Footer() {
    return (
        <footer className="relative bg-background border-t">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            <div className="relative">
                <div className="mx-auto max-w-7xl px-4 mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4">
                            <Link href="/" className="inline-block mb-6">
                                <Image
                                    src="/assets/logo.png"
                                    alt="MikArt Europe"
                                    width={200}
                                    height={55}
                                    className="h-12 w-auto rounded"
                                />
                            </Link>

                            <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm">
                                MikArt Europe is your premier destination for innovative software, tools and services.
                                Building the future of technology, one line of code at a time.
                            </p>

                            <div className="space-y-3">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        {item.link ? (
                                            <Link href={item.link} className="hover:text-foreground transition-colors">
                                                {item.text}
                                            </Link>
                                        ) : (
                                            <span>{item.text}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                {footerSections.map((section) => (
                                    <div key={section.title}>
                                        <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                                        <ul className="space-y-3">
                                            {section.links.map((link) => (
                                                <li key={link.name}>
                                                    <Link href={link.link} className="group block">
                                                        <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                            {link.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground/70 mt-0.5">
                                                            {link.description}
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                            <div className="flex flex-col gap-3">
                                {socialLinks.map((social) => (
                                    <Link
                                        key={social.name}
                                        href={social.link}
                                        className={cn(
                                            'flex items-center gap-3 text-sm text-muted-foreground transition-colors group',
                                            social.color
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <social.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                        <span className="group-hover:text-foreground">{social.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="mx-auto max-w-7xl px-4 mx-auto px-6 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} MikArt Europe. All rights reserved.
                        </div>

                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
                                Terms
                            </Link>
                            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                                Privacy
                            </Link>
                            <span>Made with ❤️ in Europe</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
