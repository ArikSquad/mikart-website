'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { MinimalPortfolioPage } from './minimal-portfolio-page'
import { PortfolioPage } from './portfolio-page'

export type LandingStyle = 'maximal' | 'minimal'

const STYLE_STORAGE_KEY = 'mikart:landing-style-v2'

const styleOptions: Array<{ id: LandingStyle; label: string }> = [
    { id: 'maximal', label: 'maximal' },
    { id: 'minimal', label: 'minimal' }
]

function isLandingStyle(value: string | null): value is LandingStyle {
    return value === 'maximal' || value === 'minimal'
}

export function LandingExperience({ initialStyle = 'minimal' }: { initialStyle?: LandingStyle }) {
    const [activeStyle, setActiveStyle] = useState<LandingStyle>(initialStyle)
    const [announcement, setAnnouncement] = useState('')
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        const queryStyle = new URLSearchParams(window.location.search).get('style')
        let savedStyle: string | null = null

        try {
            savedStyle = window.localStorage.getItem(STYLE_STORAGE_KEY)
        } catch {
            // Private browsing and locked-down browsers can deny local storage.
        }

        if (isLandingStyle(queryStyle)) {
            setActiveStyle(queryStyle)
        } else if (isLandingStyle(savedStyle)) {
            setActiveStyle(savedStyle)
        }
    }, [])

    const chooseStyle = useCallback(
        (nextStyle: LandingStyle) => {
            if (nextStyle === activeStyle) return

            setActiveStyle(nextStyle)
            setAnnouncement(`${nextStyle === 'minimal' ? 'Minimal' : 'Maximal'} landing page selected.`)

            try {
                window.localStorage.setItem(STYLE_STORAGE_KEY, nextStyle)
            } catch {
                // The URL still makes the choice shareable if storage is unavailable.
            }

            const url = new URL(window.location.href)
            url.searchParams.set('style', nextStyle)
            url.hash = ''
            window.history.replaceState({}, '', `${url.pathname}${url.search}`)

            window.requestAnimationFrame(() => {
                window.scrollTo({ top: 0, behavior: prefersReducedMotion === true ? 'auto' : 'smooth' })
            })
        },
        [activeStyle, prefersReducedMotion]
    )

    const styleControl = <StyleSwitcher activeStyle={activeStyle} onChooseStyle={chooseStyle} />

    return (
        <div className={`landing-experience landing-style-${activeStyle}`}>
            {activeStyle === 'minimal' ? (
                <motion.div
                    key="minimal"
                    className="landing-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: prefersReducedMotion === true ? 0 : 0.24, ease: 'easeOut' }}
                >
                    <MinimalPortfolioPage styleControl={styleControl} onChooseStyle={chooseStyle} />
                </motion.div>
            ) : (
                <motion.div
                    key="maximal"
                    className="landing-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: prefersReducedMotion === true ? 0 : 0.24, ease: 'easeOut' }}
                >
                    <PortfolioPage styleControl={styleControl} />
                </motion.div>
            )}

            <p className="sr-only" aria-live="polite">
                {announcement}
            </p>
        </div>
    )
}

function StyleSwitcher({
    activeStyle,
    onChooseStyle
}: {
    activeStyle: LandingStyle
    onChooseStyle: (style: LandingStyle) => void
}) {
    return (
        <div className="style-switcher" role="group" aria-label="Landing page style">
            <div className="style-switcher-options" role="radiogroup" aria-label="Choose landing page style">
                {styleOptions.map((option, index) => {
                    const selected = activeStyle === option.id

                    return (
                        <span key={option.id} className="style-switcher-option-wrap">
                            {index > 0 && <span className="style-switcher-divider">/</span>}
                            <button
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                className={`style-switcher-option ${selected ? 'is-selected' : ''}`}
                                onClick={() => onChooseStyle(option.id)}
                            >
                                {option.label}
                            </button>
                        </span>
                    )
                })}
            </div>
        </div>
    )
}
