import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getByCommentId = query({
    args: { commentId: v.id('comments') },
    handler: async (ctx, args) => {
        const replies = await ctx.db
            .query('replies')
            .withIndex('by_commentId', (q) => q.eq('commentId', args.commentId))
            .order('asc')
            .collect()

        return await Promise.all(
            replies.map(async (reply) => {
                const user = await ctx.db
                    .query('users')
                    .withIndex('by_clerkId', (q) => q.eq('clerkId', reply.userId))
                    .first()
                return {
                    ...reply,
                    userName: user?.name || 'Unknown User',
                    userImage: user?.avatar
                }
            })
        )
    }
})

export const create = mutation({
    args: {
        commentId: v.id('comments'),
        userId: v.string(),
        content: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (identity === null) {
            throw new Error('Not authenticated')
        }

        const now = Date.now()
        return await ctx.db.insert('replies', {
            commentId: args.commentId,
            userId: args.userId,
            content: args.content,
            createdAt: now,
            updatedAt: now
        })
    }
})

export const update = mutation({
    args: {
        id: v.id('replies'),
        content: v.string(),
        requesterId: v.string()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error('Reply not found')
        }

        const identity = await ctx.auth.getUserIdentity()
        if (identity === null) {
            throw new Error('Not authenticated')
        }

        const isAdmin = (identity as any).metadata.role === 'admin'
        const isOwner = existing.userId === args.requesterId

        if (!isOwner && !isAdmin) {
            throw new Error('Unauthorized')
        }

        await ctx.db.patch(args.id, {
            content: args.content,
            updatedAt: Date.now()
        })
        return args.id
    }
})

export const remove = mutation({
    args: {
        id: v.id('replies'),
        requesterId: v.string()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error('Reply not found')
        }

        const identity = await ctx.auth.getUserIdentity()
        if (identity === null) {
            throw new Error('Not authenticated')
        }

        const isOwner = existing.userId === args.requesterId
        const isAdmin = (identity as any).metadata.role === 'admin'

        if (!isOwner && !isAdmin) {
            throw new Error('Unauthorized')
        }

        const reactions = await ctx.db
            .query('reactions')
            .withIndex('by_target', (q) => q.eq('targetType', 'reply').eq('targetId', args.id))
            .collect()
        for (const reaction of reactions) {
            await ctx.db.delete(reaction._id)
        }

        await ctx.db.delete(args.id)
        return args.id
    }
})
