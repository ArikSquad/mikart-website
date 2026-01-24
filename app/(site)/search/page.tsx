'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Moon, Sun, HelpCircle } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export default function SearchClient() {
    const [query, setQuery] = useState('')
    const [showHelp, setShowHelp] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const searchParams = useSearchParams()

    const handleSearch = useCallback(
        (searchQuery: string = query) => {
            if (!searchQuery.trim()) return
            if (searchQuery.includes('mikart.eu/search?q=')) {
                toast('Achievement unlocked', {
                    description: <p className="text-white">Loop huh?</p>
                })
                return
            }

            const trimmedQuery = searchQuery.trim()
            const tokens = trimmedQuery.split(' ')
            let flag = ''
            let queryWithoutFlag: string

            const flagMap = new Map<string, string>([
                ['!gi', 'https://www.google.com/search?tbm=isch&q='],
                ['!b', 'https://www.bing.com/search?q='],
                ['!g', 'https://www.google.com/search?q='],
                ['!yt', 'https://www.youtube.com/results?search_query='],
                ['!gs', 'https://scholar.google.com/scholar?q='],
                ['!a', 'https://www.amazon.com/s?k='],
                ['!w', 'https://en.wikipedia.org/w/index.php?search='],
                ['!gh', 'https://www.github.com/search?q='],
                ['!npm', 'https://www.npmjs.com/search?q='],
                ['!mdn', 'https://developer.mozilla.org/en-US/search?q='],
                ['!so', 'https://stackoverflow.com/search?q='],
                ['!nf', 'https://www.netflix.com/search?q=']
            ])

            const flagIndex = tokens.findIndex((token) => flagMap.has(token))

            if (flagIndex !== -1) {
                flag = tokens[flagIndex]
                tokens.splice(flagIndex, 1)
            }

            queryWithoutFlag = tokens.join(' ')

            if (flag && flagMap.has(flag)) {
                window.location.href = `${flagMap.get(flag)}${encodeURIComponent(queryWithoutFlag)}`
            } else {
                // noinspection HttpUrlsUsage // this is intentional
                if (trimmedQuery.startsWith('http://') || trimmedQuery.startsWith('https://')) {
                    window.location.href = trimmedQuery
                } else {
                    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(trimmedQuery)}`
                }
            }
        },
        [query]
    )

    useEffect(() => {
        setMounted(true)
        if (searchParams) {
            const q = searchParams.get('q')
            if (q) {
                setQuery(q)
                handleSearch(q)
            }
        }
    }, [handleSearch, searchParams])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSearch()
    }

    const toggleDarkMode = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    if (!mounted) return null

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'text-white' : 'bg-gray-100 text-black'}`}
        >
            <div className="w-full max-w-md p-4 grow md:mt-72">
                <div className="flex justify-between mb-4">
                    <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                        {theme === 'dark' ? (
                            <Sun className="h-[1.2rem] w-[1.2rem]" />
                        ) : (
                            <Moon className="h-[1.2rem] w-[1.2rem]" />
                        )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowHelp(!showHelp)}>
                        <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                </div>
                {showHelp && (
                    <div className={`mb-4 p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <h2 className="font-bold mb-2">How to use:</h2>
                        <ul className="list-disc list-inside">
                            <li>Enter a full URL to go directly to that page</li>
                            <li>Use !gi at the start or end for Google Images search</li>
                            <li>Use !b at the start or end for Bing search</li>
                            <li>Just type your query for a regular Google search (or !g)</li>
                        </ul>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        value={query}
                        autoFocus={true}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter search query or URL"
                        className={`w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                    />
                    <Button type="submit" className={`w-full ${theme === 'dark' ? '' : 'bg-black text-white'}`}>
                        Search
                    </Button>
                </form>
            </div>
            <div className="text-xs text-gray-500 mt-4">
                <p>Powered by multiple search engines.</p>
            </div>
        </div>
    )
}
