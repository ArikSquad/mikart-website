import { SiBluesky, SiDiscord, SiGithub, SiX } from '@icons-pack/react-simple-icons'
import { Mail } from 'lucide-react'

export type ProjectData = {
    index: string
    name: string
    strap: string
    detail: string
    tags: readonly string[]
    image?: string
    href: string
    link: string
    theme: string
}

export const projects: readonly ProjectData[] = [
    { index: '01', name: 'Salattu', strap: 'Your digital life, secured.', detail: 'A cross-platform password manager with a Rust core, Java services, and one coherent product surface.', tags: ['React Native', 'Java', 'Next.js', 'Convex'], image: '/assets/ariksquad/salattu.png', href: 'https://salattu.mikart.eu', link: 'Visit product', theme: 'orange' },
    { index: '02', name: 'Tava', strap: 'Type safety without the ceremony.', detail: 'A Java 21 database toolkit built around canonical models, explicit adapters, and honest capabilities.', tags: ['Java 21', 'JDBC', 'NoSQL', 'DynamoDB'], href: '/docs/tava', link: 'Read the docs', theme: 'blue' },
    { index: '03', name: 'GroupSecurity', strap: 'Security that understands the game.', detail: 'Configurable security engines, actions, and audit trails for busy Minecraft communities.', tags: ['Java', 'Security', 'Minecraft'], image: '/assets/ariksquad/groupsecurity.png', href: '/docs/gs', link: 'Explore the system', theme: 'violet' },
    { index: '04', name: 'EnSave', strap: 'Community operations, composed.', detail: 'Discord automation and a focused web dashboard for moderation, management, and everyday workflows.', tags: ['TypeScript', 'Convex', 'PostgreSQL'], image: '/assets/ariksquad/ensave.png', href: 'https://ensave.mikart.eu', link: 'Open EnSave', theme: 'green' }
]

export const socials = [
    { label: 'GitHub', handle: 'ariksquad', href: 'https://github.com/ariksquad', icon: SiGithub },
    { label: 'Bluesky', handle: '@ariksquad.mikart.eu', href: 'https://bsky.app/profile/ariksquad.mikart.eu', icon: SiBluesky },
    { label: 'X', handle: '@ArikSquad', href: 'https://x.com/ArikSquad', icon: SiX },
    { label: 'Discord', handle: 'come say hello', href: '/flow/discord', icon: SiDiscord },
    { label: 'Email', handle: 'ariksquad@mikart.eu', href: 'mailto:ariksquad@mikart.eu', icon: Mail }
] as const

export const ease = [0.22, 1, 0.36, 1] as const

export function helsinkiTime() {
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Helsinki', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
}
