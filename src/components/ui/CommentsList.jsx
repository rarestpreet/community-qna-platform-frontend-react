import { useState, useRef, useEffect, useCallback } from "react"
import { FaChevronDown, FaChevronUp, FaExclamationCircle } from "react-icons/fa"
import CommentItem from "./CommentItem"

function CommentsList({ postId, postType, comments: propComments = [], hasMoreComments: propHasMore = false, onAddComment, onDeleteComment, onUpdateComment, isLoggedIn = false, commentLoader }) {
    const [isOpen, setIsOpen] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [newCommentType, setNewCommentType] = useState("DISCUSSION")
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [commentError, setCommentError] = useState("")
    const inputRef = useRef(null)

    const [localComments, setLocalComments] = useState([])
    const [localHasMore, setLocalHasMore] = useState(false)
    const [offset, setOffset] = useState(0)
    const [isFetchingMore, setIsFetchingMore] = useState(false)
    const loaderRef = useRef(null)

    useEffect(() => {
        setLocalComments(propComments)
        setLocalHasMore(propHasMore)
        setOffset(propComments.length)
    }, [propComments, propHasMore])

    const loadMore = useCallback(async () => {
        if (!localHasMore || isFetchingMore || !isOpen) return
        setIsFetchingMore(true)
        const apiCallModule = await import('../../services/apiCall')
        const response = await apiCallModule.default.getPostComments(postId, postType, 5, offset)
        if (response && response.data) {
            setLocalComments(prev => {
                const existingIds = new Set(prev.map(c => c.commentId))
                const newComments = response.data.filter(c => !existingIds.has(c.commentId))
                return [...prev, ...newComments]
            })
            setLocalHasMore(response.pageData.hasMore)
            setOffset(prev => prev + 5)
        }
        setIsFetchingMore(false)
    }, [localHasMore, isFetchingMore, isOpen, postId, offset])

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMore()
            }
        }, { threshold: 0.1 })
        
        if (loaderRef.current) observer.observe(loaderRef.current)
        
        return () => observer.disconnect()
    }, [loadMore])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCommentError("")

        if (!newComment.trim()) {
            setCommentError("Comment cannot be empty.")
            return
        }
        if (newComment.length < 20) {
            setCommentError("Comment must be at least 20 characters.")
            return
        }

        let result
        if (editingCommentId) {
            result = await onUpdateComment?.(editingCommentId, newComment)
        } else {
            result = await onAddComment?.(newComment, newCommentType)
        }

        if (result && typeof result !== "string") {
            setCommentError(result?.message || "Failed to post comment. Please try again.")
            return
        }

        setNewComment("")
        setNewCommentType("DISCUSSION")
        setEditingCommentId(null)
    }

    const handleCancelEdit = () => {
        setEditingCommentId(null)
        setNewComment("")
        setNewCommentType("DISCUSSION")
        setCommentError("")
    }

    return (
        <div className="mt-3 border-t border-gray-100 pt-2">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            >
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                {propComments.length} {propComments.length === 1 ? "comment" : "comments"}
            </button>

            {isOpen && (
                <div className="mt-2 flex flex-col divide-y divide-gray-50">
                    <span className="font-semibold text-gray-700">Comments ({localComments.length}{localHasMore ? "+" : ""})</span>
                    {localComments.map(comment => (
                        <CommentItem
                            key={comment.commentId}
                            comment={comment}
                            onDelete={onDeleteComment}
                            onEdit={(c) => {
                                setEditingCommentId(c.commentId)
                                setNewComment(c.body)
                                setNewCommentType(c.type || "DISCUSSION")
                                setCommentError("")
                                setTimeout(() => inputRef.current?.focus(), 0)
                            }}
                            isLoggedIn={isLoggedIn}
                        />
                    ))}
                    {localHasMore && (
                        <div ref={loaderRef} className="flex justify-center py-2">
                            {isFetchingMore ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-600"></div>
                            ) : (
                                <div className="h-5"></div>
                            )}
                        </div>
                    )}

                    {isLoggedIn && (
                        <div className="flex flex-col gap-1 pt-3 mt-2">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <select 
                                    value={newCommentType} 
                                    onChange={e => setNewCommentType(e.target.value)} 
                                    className="input-field text-xs py-2! px-2! shrink-0 w-28"
                                    disabled={!!editingCommentId}
                                >
                                    <option value="DISCUSSION">Discussion</option>
                                    <option value="SUGGESTION">Suggestion</option>
                                    <option value="DOUBT">Doubt</option>
                                </select>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => {
                                        setNewComment(e.target.value)
                                        setCommentError("")
                                        if (e.target.value === "" && editingCommentId) {
                                            handleCancelEdit()
                                        }
                                    }}
                                    placeholder={editingCommentId ? "Edit your comment..." : "Add a comment (20–200 chars)..."}
                                    maxLength={200}
                                    className={`input-field text-xs py-2! px-3! flex-1 ${commentError ? "input-error" : ""}`}
                                />
                                {editingCommentId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="btn-secondary text-xs! px-3! py-2!"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={commentLoader || newComment.length < 20}
                                    className="btn-primary text-xs! px-3! py-2! disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {commentLoader ? "Loading" : (editingCommentId ? "Update" : "Post")}
                                </button>
                            </form>
                            {commentError && (
                                <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium px-1">
                                    <FaExclamationCircle className="shrink-0" />
                                    {commentError}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CommentsList
