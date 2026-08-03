'use client'

import { motion } from 'framer-motion'
import { ease } from './home-data'

export function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return <span className="reveal-line"><motion.span style={{ '--reveal-delay': `${delay}s` } as React.CSSProperties} animate={{ y: 0, rotate: 0 }} transition={{ duration: 1, delay, ease }}>{children}</motion.span></span>
}

export function RevealOnScroll({ children }: { children: React.ReactNode }) {
    return <motion.div className="reveal-block" whileInView={{ clipPath: 'inset(0 0 0% 0)', y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.95, ease }}>{children}</motion.div>
}
