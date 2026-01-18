import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByPostId = query({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query("comments")
            .withIndex("by_postId", (q) => q.eq("postId", args.postId))
            .order("desc")
            .collect();

        // Get replies for each comment
        const commentsWithReplies = await Promise.all(
            comments.map(async (comment) => {
                const replies = await ctx.db
                    .query("replies")
                    .withIndex("by_commentId", (q) => q.eq("commentId", comment._id))
                    .order("asc")
                    .collect();

                return {
                    ...comment,
                    replies,
                };
            })
        );

        return commentsWithReplies;
    },
});

export const create = mutation({
    args: {
        postId: v.id("posts"),
        userId: v.string(),
        userName: v.string(),
        userImage: v.optional(v.string()),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const commentId = await ctx.db.insert("comments", {
            postId: args.postId,
            userId: args.userId,
            userName: args.userName,
            userImage: args.userImage,
            content: args.content,
            createdAt: now,
            updatedAt: now,
        });
        return commentId;
    },
});

export const update = mutation({
    args: {
        id: v.id("comments"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id);
        if (!existing) {
            throw new Error("Comment not found");
        }

        await ctx.db.patch(args.id, {
            content: args.content,
            updatedAt: Date.now(),
        });
        return args.id;
    },
});

export const remove = mutation({
    args: { id: v.id("comments") },
    handler: async (ctx, args) => {
        // Delete associated replies first
        const replies = await ctx.db
            .query("replies")
            .withIndex("by_commentId", (q) => q.eq("commentId", args.id))
            .collect();

        for (const reply of replies) {
            await ctx.db.delete(reply._id);
        }

        await ctx.db.delete(args.id);
        return args.id;
    },
});
