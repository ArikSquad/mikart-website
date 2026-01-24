import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
            .first()
    }
})

export const getOrCreate = mutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        email: v.optional(v.string()),
        avatar: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
            .first()

        if (existing) {
            if (existing.name !== args.name || existing.avatar !== args.avatar) {
                await ctx.db.patch(existing._id, {
                    name: args.name,
                    avatar: args.avatar,
                    updatedAt: Date.now()
                })
            }
            return existing._id
        }

        const now = Date.now()
        return await ctx.db.insert('users', {
            clerkId: args.clerkId,
            name: args.name,
            email: args.email,
            avatar: args.avatar,
            createdAt: now,
            updatedAt: now
        })
    }
})

export const updateProfile = mutation({
    args: {
        clerkId: v.string(),
        bio: v.optional(v.string()),
        twitter: v.optional(v.string()),
        github: v.optional(v.string()),
        website: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
            .first()

        if (!user) {
            throw new Error('User not found')
        }

        await ctx.db.patch(user._id, {
            bio: args.bio,
            twitter: args.twitter,
            github: args.github,
            website: args.website,
            updatedAt: Date.now()
        })
        return user._id
    }
})

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('users').order('desc').collect()
    }
})

export const getPostsByUserId = query({
    args: { clerkId: v.string(), publishedOnly: v.optional(v.boolean()) },
    handler: async (ctx, args) => {
        const posts = await ctx.db
            .query('posts')
            .withIndex('by_userId', (q) => q.eq('userId', args.clerkId))
            .order('desc')
            .collect()

        if (args.publishedOnly) {
            return posts.filter((p) => p.isPublished)
        }

        return posts
    }
})
