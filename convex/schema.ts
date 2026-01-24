import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
    users: defineTable({
        clerkId: v.string(),
        name: v.string(),
        email: v.optional(v.string()),
        avatar: v.optional(v.string()),
        bio: v.optional(v.string()),
        twitter: v.optional(v.string()),
        github: v.optional(v.string()),
        website: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number()
    }).index('by_clerkId', ['clerkId']),

    posts: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        content: v.any(),
        tags: v.optional(v.array(v.string())),
        slug: v.string(),
        isPublished: v.boolean(),
        followupUrl: v.optional(v.string()),
        userId: v.string(),
        viewCount: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number()
    })
        .index('by_slug', ['slug'])
        .index('by_isPublished', ['isPublished'])
        .index('by_userId', ['userId']),

    comments: defineTable({
        postId: v.id('posts'),
        userId: v.string(),
        content: v.string(),
        createdAt: v.number(),
        updatedAt: v.number()
    }).index('by_postId', ['postId']),

    replies: defineTable({
        commentId: v.id('comments'),
        userId: v.string(),
        content: v.string(),
        createdAt: v.number(),
        updatedAt: v.number()
    }).index('by_commentId', ['commentId']),

    reactions: defineTable({
        targetType: v.union(v.literal('comment'), v.literal('reply')),
        targetId: v.string(),
        userId: v.string(),
        emoji: v.string(),
        createdAt: v.number()
    })
        .index('by_target', ['targetType', 'targetId'])
        .index('by_user_target', ['userId', 'targetType', 'targetId'])
})
