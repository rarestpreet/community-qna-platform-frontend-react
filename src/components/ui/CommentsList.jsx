import { useState, useRef } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import CommentItem from "./CommentItem"

/**
 * CommentsList — collapsible comments section with add-comment form.
 * Props:
 *   - comments: CommentResponseDTO[]
 *   - onAddComment: (body: string) => Promise<void>
 *   - onDeleteComment: (commentId: number) => Promise<void>
 *   - isLoggedIn: boolean
 */
function CommentsList({ comments = [], onAddComment, onDeleteComment, onUpdateComment, isLoggedIn = false, commentLoader }) {
    const [isOpen, setIsOpen] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [editingCommentId, setEditingCommentId] = useState(null)
    const inputRef = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim() || newComment.length < 20) return

        if (editingCommentId) {
            await onUpdateComment?.(editingCommentId, newComment)
            setEditingCommentId(null)
        } else {
            await onAddComment?.(newComment)
        }
        setNewComment("")
    }

    const handleCancelEdit = () => {
        setEditingCommentId(null)
        setNewComment("")
    }

    return (
        <div className="mt-3 border-t border-gray-100 pt-2">
            {/* Toggle header */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            >
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </button>

            {/* Comments list */}
            {isOpen && (
                <div className="mt-2 flex flex-col divide-y divide-gray-50">
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.commentId}
                            comment={comment}
                            onDelete={onDeleteComment}
                            onEdit={(c) => {
                                setEditingCommentId(c.commentId)
                                setNewComment(c.body)
                                setTimeout(() => inputRef.current?.focus(), 0)
                            }}
                            isLoggedIn={isLoggedIn}
                        />
                    ))}

                    {/* Add comment form */}
                    {isLoggedIn && (
                        <form onSubmit={handleSubmit} className="flex gap-2 pt-3 mt-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newComment}
                                onChange={(e) => {
                                    setNewComment(e.target.value)
                                    if (e.target.value === "" && editingCommentId) {
                                        handleCancelEdit()
                                    }
                                }}
                                placeholder={editingCommentId ? "Edit your comment..." : "Add a comment (20–200 chars)..."}
                                maxLength={200}
                                className="input-field text-xs py-2! px-3! flex-1"
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
                                disabled={!commentLoader && newComment.length < 20}
                                className="btn-primary text-xs! px-3! py-2! disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {commentLoader ? "Loading" : (editingCommentId ? "Update" : "Post")}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}

export default CommentsList
