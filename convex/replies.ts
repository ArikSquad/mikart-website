import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByCommentId = query({
    args: { commentId: v.id("comments") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("replies")
            .withIndex("by_commentId", (q) => q.eq("commentId", args.commentId))
            .order("asc")
            .collect();
    },
});

export const create = mutation({
    args: {
        commentId: v.id("comments"),
        userId: v.string(),
        userName: v.string(),
        userImage: v.optional(v.string()),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const replyId = await ctx.db.insert("replies", {
            commentId: args.commentId,
            userId: args.userId,
            userName: args.userName,
            userImage: args.userImage,
            content: args.content,
            createdAt: now,
            updatedAt: now,
        });
        return replyId;
    },
});

export const update = mutation({
    args: {
        id: v.id("replies"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id);
        if (!existing) {
            throw new Error("Reply not found");
        }

        await ctx.db.patch(args.id, {
            content: args.content,
            updatedAt: Date.now(),
        });
        return args.id;
    },
});

export const remove = mutation({
    args: { id: v.id("replies") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return args.id;
    },
});
