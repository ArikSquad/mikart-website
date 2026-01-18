"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, Eye } from "lucide-react"

interface ViewsChartProps {
    postId?: string
    postSlug?: string
    title?: string
}

interface ViewData {
    date: string
    views: number
}

export function ViewsChart({ postId, postSlug, title }: ViewsChartProps) {
    const [data, setData] = useState<ViewData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalViews, setTotalViews] = useState(0)

    useEffect(() => {
        const fetchViewsData = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // For now, generate mock data since PostHog API requires server-side setup
                // In production, you would call your API route that fetches from PostHog
                const mockData = generateMockViewsData()
                setData(mockData)
                setTotalViews(mockData.reduce((sum, d) => sum + d.views, 0))
            } catch (err) {
                setError("Failed to load views data")
                console.error("Error fetching views:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchViewsData()
    }, [postId, postSlug])

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Views Over Time
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">{error}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {title || "Views Over Time"}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {totalViews.toLocaleString()} total views in the last 30 days
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                className="fill-muted-foreground"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                className="fill-muted-foreground"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

function generateMockViewsData(): ViewData[] {
    const data: ViewData[] = []
    const now = new Date()

    for (let i = 29; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        data.push({
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            views: Math.floor(Math.random() * 100) + 10,
        })
    }

    return data
}

interface MultiPostViewsChartProps {
    posts: Array<{
        _id: string
        title: string
        slug: string
        viewCount: number
    }>
}

export function MultiPostViewsChart({ posts }: MultiPostViewsChartProps) {
    const [data, setData] = useState<Array<Record<string, string | number>>>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Generate mock data for multiple posts
        const mockData = generateMultiPostMockData(posts.slice(0, 5)) // Limit to 5 posts
        setData(mockData)
        setIsLoading(false)
    }, [posts])

    const colors = [
        "hsl(var(--primary))",
        "hsl(210, 100%, 50%)",
        "hsl(150, 100%, 40%)",
        "hsl(30, 100%, 50%)",
        "hsl(280, 100%, 50%)",
    ]

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[400px] w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Post Views Comparison
                </CardTitle>
                <CardDescription>
                    Comparing views across your top posts over the last 14 days
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            {posts.slice(0, 5).map((post, index) => (
                                <Line
                                    key={post._id}
                                    type="monotone"
                                    dataKey={post.slug}
                                    name={post.title.length > 20 ? post.title.slice(0, 20) + "..." : post.title}
                                    stroke={colors[index]}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

function generateMultiPostMockData(posts: Array<{ slug: string }>): Array<Record<string, string | number>> {
    const data: Array<Record<string, string | number>> = []
    const now = new Date()

    for (let i = 13; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        const dataPoint: Record<string, string | number> = {
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        }

        posts.forEach((post) => {
            dataPoint[post.slug] = Math.floor(Math.random() * 50) + 5
        })

        data.push(dataPoint)
    }

    return data
}
