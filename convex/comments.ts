import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getByPostId = query({
    args: { postId: v.id('posts') },
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query('comments')
            .withIndex('by_postId', (q) => q.eq('postId', args.postId))
            .order('desc')
            .collect()

        return await Promise.all(
            comments.map(async (comment) => {
                const replies = await ctx.db
                    .query('replies')
                    .withIndex('by_commentId', (q) => q.eq('commentId', comment._id))
                    .order('asc')
                    .collect()

                const user = await ctx.db
                    .query('users')
                    .withIndex('by_clerkId', (q) => q.eq('clerkId', comment.userId))
                    .first()

                const repliesWithUsers = await Promise.all(
                    replies.map(async (reply) => {
                        const replyUser = await ctx.db
                            .query('users')
                            .withIndex('by_clerkId', (q) => q.eq('clerkId', reply.userId))
                            .first()
                        return {
                            ...reply,
                            userName: replyUser?.name || 'Unknown User',
                            userImage: replyUser?.avatar
                        }
                    })
                )

                return {
                    ...comment,
                    userName: user?.name || 'Unknown User',
                    userImage: user?.avatar,
                    replies: repliesWithUsers
                }
            })
        )
    }
})

export const create = mutation({
    args: {
        postId: v.id('posts'),
        userId: v.string(),
        content: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (identity === null) {
            throw new Error('Not authenticated')
        }

        const now = Date.now()
        return await ctx.db.insert('comments', {
            postId: args.postId,
            userId: args.userId,
            content: args.content,
            createdAt: now,
            updatedAt: now
        })
    }
})

export const update = mutation({
    args: {
        id: v.id('comments'),
        content: v.string(),
        requesterId: v.string()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error('Comment not found')
        }

        const identity = await ctx.auth.getUserIdentity()
        if (identity === null) {
            throw new Error('Not authenticated')
        }

        const isOwner = existing.userId === args.requesterId
        const isAdmin = (identity as any).metadata.role !== 'admin'

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
        id: v.id('comments'),
        requesterId: v.string()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error('Comment not found')
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

        const replies = await ctx.db
            .query('replies')
            .withIndex('by_commentId', (q) => q.eq('commentId', args.id))
            .collect()

        for (const reply of replies) {
            const replyReactions = await ctx.db
                .query('reactions')
                .withIndex('by_target', (q) => q.eq('targetType', 'reply').eq('targetId', reply._id))
                .collect()
            for (const reaction of replyReactions) {
                await ctx.db.delete(reaction._id)
            }
            await ctx.db.delete(reply._id)
        }

        const commentReactions = await ctx.db
            .query('reactions')
            .withIndex('by_target', (q) => q.eq('targetType', 'comment').eq('targetId', args.id))
            .collect()
        for (const reaction of commentReactions) {
            await ctx.db.delete(reaction._id)
        }

        await ctx.db.delete(args.id)
        return args.id
    }
})
