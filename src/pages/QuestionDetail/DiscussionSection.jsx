import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FaExclamationCircle } from 'react-icons/fa'
import { useUserContext } from "../../context/userContext"

export default function DiscussionSection({ comments, onAddComment, onDeleteComment, onUpdateComment, commentLoader }) {
    const navigate = useNavigate()
    const { userProfile } = useUserContext()
    const canComment = userProfile?.roles === "USER" || userProfile?.roles === "VERIFIED_USER"
    const [newComment, setNewComment] = useState("")
    const [newCommentType, setNewCommentType] = useState("DISCUSSION")
    const [commentError, setCommentError] = useState("")
    
    // We could implement edit/delete later via action menus, keeping it simple for now as per design

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

        const result = await onAddComment?.(newComment, newCommentType)
        if (result && typeof result !== "string") {
            setCommentError(result?.message || "Failed to post comment.")
            return
        }

        setNewComment("")
        setNewCommentType("DISCUSSION")
    }

    const getTypeColor = (type) => {
        switch (type) {
            case 'DOUBT': return 'bg-tertiary-container text-on-tertiary-container'
            case 'SUGGESTION': return 'bg-primary-container text-on-primary-container'
            case 'DISCUSSION':
            default: return 'bg-secondary-container text-on-secondary-container'
        }
    }

    return (
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-6">Discussion ({comments.length})</h3>
            
            <div className="space-y-6 mb-8">
                {comments.map((comment, index) => (
                    <div key={comment.commentId || index} className="flex gap-4">
                        <div 
                            className="w-8 h-8 rounded-full bg-surface-variant shrink-0 overflow-hidden border border-outline-variant flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate(`/profile/${comment.authorUsername}`)}
                        >
                            {comment.authorUsername?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 bg-surface border border-outline-variant rounded-xl p-4 shadow-sm">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span 
                                    className="font-bold text-label-md text-on-surface cursor-pointer hover:underline"
                                    onClick={() => navigate(`/profile/${comment.authorUsername}`)}
                                >
                                    @{comment.authorUsername}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getTypeColor(comment.type)}`}>
                                    {comment.type || 'DISCUSSION'}
                                </span>
                                <span className="text-on-surface-variant text-[10px]">{comment.createdAt || comment.updatedAt}</span>
                            </div>
                            <p className="text-body-sm text-on-surface whitespace-pre-wrap">{comment.body}</p>
                        </div>
                    </div>
                ))}
                
                {comments.length === 0 && (
                    <div className="text-center text-on-surface-variant text-body-sm py-4">
                        No comments yet. Be the first to start the discussion!
                    </div>
                )}
            </div>

            {canComment && (
                <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-sm">
                    <form onSubmit={handleSubmit}>
                        <textarea 
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[100px] text-body-sm mb-3 text-on-surface" 
                            placeholder="Leave a comment (min 20 characters)..."
                            value={newComment}
                            onChange={(e) => {
                                setNewComment(e.target.value)
                                setCommentError("")
                            }}
                        ></textarea>
                        
                        {commentError && (
                            <p className="flex items-center gap-1.5 text-error text-xs font-medium px-1 mb-3">
                                <FaExclamationCircle className="shrink-0" />
                                {commentError}
                            </p>
                        )}
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex gap-2 w-full sm:w-auto">
                                <select 
                                    className="bg-surface-container-high border-none rounded-lg text-label-sm py-2 px-3 focus:ring-2 focus:ring-primary w-full sm:w-auto outline-none"
                                    value={newCommentType}
                                    onChange={(e) => setNewCommentType(e.target.value)}
                                >
                                    <option value="DISCUSSION">Discussion</option>
                                    <option value="SUGGESTION">Suggestion</option>
                                    <option value="DOUBT">Doubt</option>
                                </select>
                            </div>
                            <button 
                                type="submit"
                                disabled={commentLoader || newComment.length < 20}
                                className="w-full sm:w-auto bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {commentLoader ? "Posting..." : "Post Comment"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
