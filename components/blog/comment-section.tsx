'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { formatDistanceToNow } from 'date-fns'
import { useUser, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
    Reply,
    ChevronDown,
    ChevronUp,
    Send,
    Loader2,
    MoreHorizontal,
    Pencil,
    Trash2,
    X,
    Check,
    Shield,
    SmilePlus
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const AVAILABLE_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🎉'] as const

interface Reply {
    _id: Id<'replies'>
    commentId: Id<'comments'>
    userId: string
    userName: string
    userImage?: string
    content: string
    createdAt: number
    updatedAt: number
}

interface Comment {
    _id: Id<'comments'>
    postId: Id<'posts'>
    userId: string
    userName: string
    userImage?: string
    content: string
    createdAt: number
    updatedAt: number
    replies: Reply[]
}

interface CommentSectionProps {
    postId: Id<'posts'>
    comments: Comment[]
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
    const { user, isSignedIn } = useUser()
    const [newComment, setNewComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const createComment = useMutation(api.comments.create)
    const getOrCreateUser = useMutation(api.users.getOrCreate)

    const isAdmin = user?.publicMetadata?.role === 'admin'

    useEffect(() => {
        if (user) {
            getOrCreateUser({
                clerkId: user.id,
                name: user.fullName || user.username || 'Anonymous',
                email: user.emailAddresses[0]?.emailAddress,
                avatar: user.imageUrl
            })
        }
    }, [user, getOrCreateUser])

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !user) return

        setIsSubmitting(true)
        try {
            await createComment({
                postId,
                userId: user.id,
                content: newComment.trim()
            })
            setNewComment('')
            toast.success('Comment posted!')
        } catch (error) {
            console.error('Failed to create comment:', error)
            toast.error('Failed to post comment')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="blog-discussion">
            <div className="blog-discussion-heading">
                <h2>
                    Discussion <span>{comments.length}</span>
                </h2>
            </div>

            {isSignedIn ? (
                <div className="flex gap-4">
                    <Link href={`/profile/${user?.id}`}>
                        <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm shrink-0 hover:ring-primary/20 transition-all">
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {user?.firstName?.[0] || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex-1 space-y-3">
                        <Textarea
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={3}
                            className="resize-none bg-muted/30 border-muted-foreground/20 focus:bg-background transition-colors"
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSubmitComment}
                                disabled={isSubmitting || !newComment.trim()}
                                size="sm"
                                className="gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                Post comment
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="blog-signin">
                    <p>Have something to add?</p>
                    <SignInButton mode="modal">
                        <button type="button" className="blog-signin-link">
                            Sign in to join the discussion <span aria-hidden="true">→</span>
                        </button>
                    </SignInButton>
                </div>
            )}

            <div className="blog-comment-list">
                {comments.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} isAdmin={isAdmin} currentUserId={user?.id} />
                ))}
                {comments.length === 0 && <p className="blog-discussion-empty">No comments yet.</p>}
            </div>
        </div>
    )
}

interface CommentItemProps {
    comment: Comment
    isAdmin: boolean
    currentUserId?: string
}

function CommentItem({ comment, isAdmin, currentUserId }: CommentItemProps) {
    const { user, isSignedIn } = useUser()
    const [showReplies, setShowReplies] = useState(comment.replies.length > 0)
    const [replyContent, setReplyContent] = useState('')
    const [isReplying, setIsReplying] = useState(false)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const [isUpdating, setIsUpdating] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const createReply = useMutation(api.replies.create)
    const updateComment = useMutation(api.comments.update)
    const deleteComment = useMutation(api.comments.remove)
    const toggleReaction = useMutation(api.reactions.toggle)

    const reactions = useQuery(api.reactions.getByTarget, {
        targetType: 'comment',
        targetId: comment._id
    })

    const isOwner = currentUserId === comment.userId
    const canModify = isOwner || isAdmin
    const wasEdited = comment.updatedAt > comment.createdAt + 1000

    const handleSubmitReply = async () => {
        if (!replyContent.trim() || !user) return

        setIsReplying(true)
        try {
            await createReply({
                commentId: comment._id,
                userId: user.id,
                content: replyContent.trim()
            })
            setReplyContent('')
            setShowReplyForm(false)
            setShowReplies(true)
        } catch (error) {
            console.error('Failed to create reply:', error)
        } finally {
            setIsReplying(false)
        }
    }

    const handleUpdateComment = async () => {
        if (!editContent.trim() || !currentUserId) return

        setIsUpdating(true)
        try {
            await updateComment({
                id: comment._id,
                content: editContent.trim(),
                requesterId: currentUserId
            })
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update comment:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteComment = async () => {
        if (!currentUserId) return
        setIsDeleting(true)
        try {
            await deleteComment({ id: comment._id, requesterId: currentUserId })
        } catch (error) {
            console.error('Failed to delete comment:', error)
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    const handleReaction = async (emoji: string) => {
        if (!currentUserId) return
        try {
            await toggleReaction({
                targetType: 'comment',
                targetId: comment._id,
                userId: currentUserId,
                emoji
            })
        } catch (error) {
            console.error('Failed to toggle reaction:', error)
        }
    }

    return (
        <div className="blog-comment group">
            <div className="flex gap-4">
                <Link href={`/profile/${comment.userId}`}>
                    <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm shrink-0 hover:ring-primary/20 transition-all cursor-pointer">
                        <AvatarImage src={comment.userImage} />
                        <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                            {comment.userName?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Link
                                href={`/profile/${comment.userId}`}
                                className="font-semibold text-sm hover:text-primary transition-colors"
                            >
                                {comment.userName}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                            {wasEdited && (
                                <span
                                    className="blog-edited"
                                    title={`Edited ${new Date(comment.updatedAt).toLocaleDateString()}`}
                                >
                                    Edited
                                </span>
                            )}
                        </div>
                        {canModify && !isEditing && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-70 hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="blog-theme">
                                    {isOwner && (
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setEditContent(comment.content)
                                                setIsEditing(true)
                                            }}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                        {isAdmin && !isOwner && (
                                            <Badge variant="outline" className="ml-2 text-xs">
                                                <Shield className="h-3 w-3 mr-1" />
                                                Admin
                                            </Badge>
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-2 space-y-2">
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={3}
                                className="resize-none"
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setIsEditing(false)
                                        setEditContent(comment.content)
                                    }}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleUpdateComment}
                                    disabled={isUpdating || !editContent.trim()}
                                >
                                    {isUpdating ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                        <Check className="h-4 w-4 mr-1" />
                                    )}
                                    Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm mt-1.5 whitespace-pre-wrap text-foreground/90 leading-relaxed">
                            {comment.content}
                        </p>
                    )}

                    {!isEditing && (
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                            {reactions &&
                                reactions.map((reaction) => (
                                    <Button
                                        key={reaction.emoji}
                                        variant="outline"
                                        size="sm"
                                        className={cn(
                                            'h-7 px-2 text-xs gap-1',
                                            reaction.userIds.includes(currentUserId || '') &&
                                                'bg-primary/10 border-primary/30'
                                        )}
                                        onClick={() => handleReaction(reaction.emoji)}
                                        disabled={!currentUserId}
                                    >
                                        <span>{reaction.emoji}</span>
                                        <span>{reaction.count}</span>
                                    </Button>
                                ))}

                            {isSignedIn && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                        >
                                            <SmilePlus className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="blog-theme w-auto p-2" align="start">
                                        <div className="flex gap-1">
                                            {AVAILABLE_EMOJIS.map((emoji) => (
                                                <Button
                                                    key={emoji}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-lg hover:bg-muted"
                                                    onClick={() => handleReaction(emoji)}
                                                >
                                                    {emoji}
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}

                            {isSignedIn && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                >
                                    <Reply className="h-3.5 w-3.5 mr-1.5" />
                                    Reply
                                </Button>
                            )}
                            {comment.replies.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowReplies(!showReplies)}
                                >
                                    {showReplies ? (
                                        <ChevronUp className="h-3.5 w-3.5 mr-1.5" />
                                    ) : (
                                        <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
                                    )}
                                    {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                </Button>
                            )}
                        </div>
                    )}

                    {showReplyForm && isSignedIn && (
                        <div className="mt-4 flex gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback className="text-xs">{user?.firstName?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <Textarea
                                    placeholder="Write a reply..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    rows={2}
                                    className="text-sm resize-none"
                                    autoFocus
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setShowReplyForm(false)
                                            setReplyContent('')
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
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                        ) : (
                                            <Send className="h-3 w-3 mr-1" />
                                        )}
                                        Reply
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showReplies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-muted">
                            {comment.replies.map((reply) => (
                                <ReplyItem
                                    key={reply._id}
                                    reply={reply}
                                    isAdmin={isAdmin}
                                    currentUserId={currentUserId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="blog-theme">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this comment and all its replies. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteComment}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

interface ReplyItemProps {
    reply: Reply
    isAdmin: boolean
    currentUserId?: string
}

function ReplyItem({ reply, isAdmin, currentUserId }: ReplyItemProps) {
    const { isSignedIn } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(reply.content)
    const [isUpdating, setIsUpdating] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const updateReply = useMutation(api.replies.update)
    const deleteReply = useMutation(api.replies.remove)
    const toggleReaction = useMutation(api.reactions.toggle)

    const reactions = useQuery(api.reactions.getByTarget, {
        targetType: 'reply',
        targetId: reply._id
    })

    const isOwner = currentUserId === reply.userId
    const canModify = isOwner || isAdmin
    const wasEdited = reply.updatedAt > reply.createdAt + 1000

    const handleUpdateReply = async () => {
        if (!editContent.trim() || !currentUserId) return

        setIsUpdating(true)
        try {
            await updateReply({
                id: reply._id,
                content: editContent.trim(),
                requesterId: currentUserId
            })
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update reply:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteReply = async () => {
        if (!currentUserId) return
        setIsDeleting(true)
        try {
            await deleteReply({ id: reply._id, requesterId: currentUserId })
        } catch (error) {
            console.error('Failed to delete reply:', error)
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    const handleReaction = async (emoji: string) => {
        if (!currentUserId) return
        try {
            await toggleReaction({
                targetType: 'reply',
                targetId: reply._id,
                userId: currentUserId,
                emoji
            })
        } catch (error) {
            console.error('Failed to toggle reaction:', error)
        }
    }

    return (
        <div className="group flex gap-3">
            <Link href={`/profile/${reply.userId}`}>
                <Avatar className="h-8 w-8 shrink-0 hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                    <AvatarImage src={reply.userImage} />
                    <AvatarFallback className="text-xs bg-muted">
                        {reply.userName?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href={`/profile/${reply.userId}`}
                            className="font-semibold text-sm hover:text-primary transition-colors"
                        >
                            {reply.userName}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                        {wasEdited && (
                            <span
                                className="blog-edited"
                                title={`Edited ${new Date(reply.updatedAt).toLocaleDateString()}`}
                            >
                                Edited
                            </span>
                        )}
                    </div>
                    {canModify && !isEditing && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 opacity-70 hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                                >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="blog-theme">
                                {isOwner && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setEditContent(reply.content)
                                            setIsEditing(true)
                                        }}
                                    >
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                    {isAdmin && !isOwner && (
                                        <Badge variant="outline" className="ml-2 text-xs">
                                            <Shield className="h-3 w-3 mr-1" />
                                            Admin
                                        </Badge>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {isEditing ? (
                    <div className="mt-2 space-y-2">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={2}
                            className="resize-none text-sm"
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsEditing(false)
                                    setEditContent(reply.content)
                                }}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleUpdateReply} disabled={isUpdating || !editContent.trim()}>
                                {isUpdating ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                    <Check className="h-4 w-4 mr-1" />
                                )}
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm mt-1 whitespace-pre-wrap text-foreground/90">{reply.content}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {reactions &&
                                reactions.map((reaction) => (
                                    <Button
                                        key={reaction.emoji}
                                        variant="outline"
                                        size="sm"
                                        className={cn(
                                            'h-6 px-1.5 text-xs gap-1',
                                            reaction.userIds.includes(currentUserId || '') &&
                                                'bg-primary/10 border-primary/30'
                                        )}
                                        onClick={() => handleReaction(reaction.emoji)}
                                        disabled={!currentUserId}
                                    >
                                        <span>{reaction.emoji}</span>
                                        <span>{reaction.count}</span>
                                    </Button>
                                ))}

                            {isSignedIn && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                                        >
                                            <SmilePlus className="h-3.5 w-3.5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="blog-theme w-auto p-2" align="start">
                                        <div className="flex gap-1">
                                            {AVAILABLE_EMOJIS.map((emoji) => (
                                                <Button
                                                    key={emoji}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 text-base hover:bg-muted"
                                                    onClick={() => handleReaction(emoji)}
                                                >
                                                    {emoji}
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    </>
                )}
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="blog-theme">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete reply?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete your reply. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteReply}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
