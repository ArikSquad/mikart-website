"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formatDistanceToNow } from "date-fns"
import { useUser, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Reply, ChevronDown, ChevronUp, Send, Loader2 } from "lucide-react"

interface Reply {
    _id: Id<"replies">
    commentId: Id<"comments">
    userId: string
    userName: string
    userImage?: string
    content: string
    createdAt: number
    updatedAt: number
}

interface Comment {
    _id: Id<"comments">
    postId: Id<"posts">
    userId: string
    userName: string
    userImage?: string
    content: string
    createdAt: number
    updatedAt: number
    replies: Reply[]
}

interface CommentSectionProps {
    postId: Id<"posts">
    comments: Comment[]
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
    const { user, isSignedIn } = useUser()
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const createComment = useMutation(api.comments.create)

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !user) return

        setIsSubmitting(true)
        try {
            await createComment({
                postId,
                userId: user.id,
                userName: user.fullName || user.username || "Anonymous",
                userImage: user.imageUrl,
                content: newComment.trim(),
            })
            setNewComment("")
        } catch (error) {
            console.error("Failed to create comment:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Comments ({comments.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {isSignedIn ? (
                    <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={3}
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmitComment}
                                    disabled={isSubmitting || !newComment.trim()}
                                    size="sm"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 border rounded-lg">
                        <p className="text-muted-foreground mb-2">Sign in to leave a comment</p>
                        <SignInButton mode="modal">
                            <Button variant="outline">Sign In</Button>
                        </SignInButton>
                    </div>
                )}

                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))}
                    {comments.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                            No comments yet. Be the first to comment!
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function CommentItem({ comment }: { comment: Comment }) {
    const { user, isSignedIn } = useUser()
    const [showReplies, setShowReplies] = useState(false)
    const [replyContent, setReplyContent] = useState("")
    const [isReplying, setIsReplying] = useState(false)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const createReply = useMutation(api.replies.create)

    const handleSubmitReply = async () => {
        if (!replyContent.trim() || !user) return

        setIsReplying(true)
        try {
            await createReply({
                commentId: comment._id,
                userId: user.id,
                userName: user.fullName || user.username || "Anonymous",
                userImage: user.imageUrl,
                content: replyContent.trim(),
            })
            setReplyContent("")
            setShowReplyForm(false)
            setShowReplies(true)
        } catch (error) {
            console.error("Failed to create reply:", error)
        } finally {
            setIsReplying(false)
        }
    }

    return (
        <div className="border-l-2 border-muted pl-4">
            <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.userImage} />
                    <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                        {isSignedIn && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                            >
                                <Reply className="h-3 w-3" />
                                Reply
                            </Button>
                        )}
                        {comment.replies.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {showReplies ? (
                                    <ChevronUp className="h-3 w-3" />
                                ) : (
                                    <ChevronDown className="h-3 w-3" />
                                )}
                                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                            </Button>
                        )}
                    </div>

                    {showReplyForm && isSignedIn && (
                        <div className="mt-3 space-y-2">
                            <Textarea
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                rows={2}
                                className="text-sm"
                            />
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setShowReplyForm(false)
                                        setReplyContent("")
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSubmitReply}
                                    disabled={isReplying || !replyContent.trim()}
                                >
                                    {isReplying ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <Send className="h-3 w-3" />
                                    )}
                                    Reply
                                </Button>
                            </div>
                        </div>
                    )}

                    {showReplies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {comment.replies.map((reply) => (
                                <div key={reply._id} className="flex gap-3 border-l pl-4">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={reply.userImage} />
                                        <AvatarFallback>{reply.userName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-xs">{reply.userName}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm mt-1 whitespace-pre-wrap">{reply.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
