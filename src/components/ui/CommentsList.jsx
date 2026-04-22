import { useState } from "react"
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
function CommentsList({ comments = [], onAddComment, onDeleteComment, isLoggedIn = false }) {
    const [isOpen, setIsOpen] = useState(false)
    const [newComment, setNewComment] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim() || newComment.length < 10) return

        await onAddComment?.(newComment)
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
                        />
                    ))}

                    {/* Add comment form */}
                    {isLoggedIn && (
                        <form onSubmit={handleSubmit} className="flex gap-2 pt-3 mt-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment (10–100 chars)..."
                                maxLength={100}
                                className="input-field text-xs py-2! px-3! flex-1"
                            />
                            <button
                                type="submit"
                                disabled={newComment.length < 10}
                                className="btn-primary text-xs! px-3! py-2! disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}

export default CommentsList
