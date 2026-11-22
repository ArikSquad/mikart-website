'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopyAddress({ compact = false }: { compact?: boolean }) {
    const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(
        () => () => {
            if (timer.current) clearTimeout(timer.current)
        },
        []
    )

    async function copy() {
        if (timer.current) clearTimeout(timer.current)
        try {
            await navigator.clipboard.writeText('play.mikart.eu')
            setStatus('copied')
        } catch {
            setStatus('error')
        }
        timer.current = setTimeout(() => setStatus('idle'), 4000)
    }

    return (
        <div className={compact ? 'copy-wrap compact' : 'copy-wrap'}>
            <button className="server-button" onClick={copy} aria-label="Copy server address play.mikart.eu">
                <span>{status === 'copied' ? 'ADDRESS COPIED' : compact ? 'COPY SERVER IP' : 'PLAY.MIKART.EU'}</span>
                {status === 'copied' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            </button>
            <span className="copy-feedback" role="status">
                {status === 'copied'
                    ? 'Paste into Minecraft → Multiplayer → Add Server.'
                    : status === 'error'
                      ? 'Copy manually: play.mikart.eu'
                      : ''}
            </span>
        </div>
    )
}
