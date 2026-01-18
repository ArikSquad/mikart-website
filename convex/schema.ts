import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    posts: defineTable({
        title: v.string(),
        content: v.any(),
        tags: v.optional(v.array(v.string())),
        userId: v.string(),
        slug: v.string(),
        isPublished: v.boolean(),
        followupUrl: v.optional(v.string()),
        viewCount: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_slug", ["slug"])
        .index("by_userId", ["userId"])
        .index("by_isPublished", ["isPublished"]),

    comments: defineTable({
        postId: v.id("posts"),
        userId: v.string(),
        userName: v.string(),
        userImage: v.optional(v.string()),
        content: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_postId", ["postId"]),

    replies: defineTable({
        commentId: v.id("comments"),
        userId: v.string(),
        userName: v.string(),
        userImage: v.optional(v.string()),
        content: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_commentId", ["commentId"]),
});