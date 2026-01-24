import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('posts').order('desc').collect()
    }
})

export const listPublished = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query('posts')
            .withIndex('by_isPublished', (q) => q.eq('isPublished', true))
            .order('desc')
            .collect()
    }
})

export const getById = query({
    args: { id: v.id('posts') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id)
    }
})

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('posts')
            .withIndex('by_slug', (q) => q.eq('slug', args.slug))
            .first()
    }
})

export const getBySlugWithAuthor = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const post = await ctx.db
            .query('posts')
            .withIndex('by_slug', (q) => q.eq('slug', args.slug))
            .first()

        if (!post) return null

        const author = await ctx.db
            .query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', post.userId))
            .first()

        return {
            ...post,
            author: author
                ? {
                      clerkId: author.clerkId,
                      name: author.name,
                      avatar: author.avatar,
                      bio: author.bio
                  }
                : null
        }
    }
})

export const create = mutation({
    args: {
        title: v.string(),
        content: v.any(),
        tags: v.optional(v.array(v.string())),
        slug: v.string(),
        isPublished: v.boolean(),
        followupUrl: v.optional(v.string()),
        userId: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', args.userId))
            .first()

        const identity = await ctx.auth.getUserIdentity()
        if (identity === null) {
            throw new Error('Not authenticated')
        }

        if ((identity as any).metadata.role !== 'admin') {
            throw new Error('Only admins can create posts')
        }

        const now = Date.now()
        return await ctx.db.insert('posts', {
            title: args.title,
            content: args.content,
            tags: args.tags,
            slug: args.slug,
            isPublished: args.isPublished,
            followupUrl: args.followupUrl,
            userId: args.userId,
            createdAt: now,
            updatedAt: now
        })
    }
})

export const update = mutation({
    args: {
        id: v.id('posts'),
        title: v.optional(v.string()),
        content: v.optional(v.any()),
        tags: v.optional(v.array(v.string())),
        slug: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
        followupUrl: v.optional(v.string()),
        requesterId: v.string()
    },
    handler: async (ctx, args) => {
        const { id, requesterId, ...updates } = args
        const existing = await ctx.db.get(id)
        if (!existing) {
            throw new Error('Post not found')
        }

        const user = await ctx.db
            .query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', requesterId))
            .first()

        const identity = await ctx.auth.getUserIdentity()
        if (identity === null) {
            throw new Error('Not authenticated')
        }

        if ((identity as any).metadata.role !== 'admin') {
            throw new Error('Only admins can create posts')
        }

        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now()
        })
        return id
    }
})

export const remove = mutation({
    args: { id: v.id('posts') },
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query('comments')
            .withIndex('by_postId', (q) => q.eq('postId', args.id))
            .collect()

        for (const comment of comments) {
            const replies = await ctx.db
                .query('replies')
                .withIndex('by_commentId', (q) => q.eq('commentId', comment._id))
                .collect()

            for (const reply of replies) {
                await ctx.db.delete(reply._id)
            }
            await ctx.db.delete(comment._id)
        }

        await ctx.db.delete(args.id)
        return args.id
    }
})

export const getWithStats = query({
    args: {},
    handler: async (ctx) => {
        const posts = await ctx.db.query('posts').order('desc').collect()
        return await Promise.all(
            posts.map(async (post) => {
                const comments = await ctx.db
                    .query('comments')
                    .withIndex('by_postId', (q) => q.eq('postId', post._id))
                    .collect()

                let replyCount = 0
                for (const comment of comments) {
                    const replies = await ctx.db
                        .query('replies')
                        .withIndex('by_commentId', (q) => q.eq('commentId', comment._id))
                        .collect()
                    replyCount += replies.length
                }

                return {
                    ...post,
                    commentCount: comments.length,
                    replyCount
                }
            })
        )
    }
})
