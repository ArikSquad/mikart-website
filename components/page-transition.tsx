import { ViewTransition, type ReactNode } from 'react'

const pageTransition = {
    'nav-forward': 'nav-forward',
    'nav-back': 'nav-back',
    default: 'page-fade'
} as const

/**
 * Gives route content a meaningful transition while leaving shared layouts
 * and headers mounted as navigation changes.
 */
export function PageTransition({ children }: { children: ReactNode }) {
    return (
        <ViewTransition default="page-fade" enter={pageTransition} exit={pageTransition}>
            {children}
        </ViewTransition>
    )
}
