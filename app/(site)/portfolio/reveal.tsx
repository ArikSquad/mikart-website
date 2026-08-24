'use client'

import { motion } from 'framer-motion'
import { ease } from './home-data'

export function RevealOnScroll({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.75, ease }}
        >
            {children}
        </motion.div>
    )
}
