import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const AVAILABLE_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🎉'] as const

export const getByTarget = query({
    args: {
        targetType: v.union(v.literal('comment'), v.literal('reply')),
        targetId: v.string()
    },
    handler: async (ctx, args) => {
        const reactions = await ctx.db
            .query('reactions')
            .withIndex('by_target', (q) => q.eq('targetType', args.targetType).eq('targetId', args.targetId))
            .collect()

        const grouped: Record<string, { emoji: string; count: number; userIds: string[] }> = {}
        for (const reaction of reactions) {
            if (!grouped[reaction.emoji]) {
                grouped[reaction.emoji] = { emoji: reaction.emoji, count: 0, userIds: [] }
            }
            grouped[reaction.emoji].count++
            grouped[reaction.emoji].userIds.push(reaction.userId)
        }

        return Object.values(grouped)
    }
})

export const toggle = mutation({
    args: {
        targetType: v.union(v.literal('comment'), v.literal('reply')),
        targetId: v.string(),
        userId: v.string(),
        emoji: v.string()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query('reactions')
            .withIndex('by_user_target', (q) =>
                q.eq('userId', args.userId).eq('targetType', args.targetType).eq('targetId', args.targetId)
            )
            .filter((q) => q.eq(q.field('emoji'), args.emoji))
            .first()

        if (existing) {
            await ctx.db.delete(existing._id)
            return { action: 'removed' }
        }

        await ctx.db.insert('reactions', {
            targetType: args.targetType,
            targetId: args.targetId,
            userId: args.userId,
            emoji: args.emoji,
            createdAt: Date.now()
        })
        return { action: 'added' }
    }
})
