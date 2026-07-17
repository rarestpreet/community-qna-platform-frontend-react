import React, { useState } from 'react'
import { 
    FaRegComments,
    FaCheckCircle,
    FaThumbsUp,
    FaThumbsDown,
    FaChevronDown,
    FaChevronUp,
    FaCheck
} from 'react-icons/fa'
import DiscussionSection from "./DiscussionSection"
import ActionMenu from "../../components/ui/ActionMenu"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../context/userContext"
import apiCall from "../../services/apiCall"

export default function SolutionsList({ 
    solutions, 
    onVote, 
    onAddComment, 
    onDeleteComment, 
    onUpdateComment, 
    onToggleStatus, 
    isAdmin,
    commentLoader,
    operable,
    setLoading
}) {
    const navigate = useNavigate()
    const { userProfile } = useUserContext()

    return (
        <div className="space-y-8">
            {/* Solutions Divider */}
            <div className="flex items-center gap-4 py-4">
                <div className="h-px flex-1 bg-outline-variant"></div>
                <span className="font-headline-sm text-on-surface-variant">Proposed Solutions ({solutions.length})</span>
                <div className="h-px flex-1 bg-outline-variant"></div>
            </div>

            {/* Solution List */}
            <div className="space-y-8">
                {solutions.map(solution => (
                            <SolutionCard 
                        key={solution.id}
                        solution={solution}
                        onVote={(voteType) => onVote(solution.id, voteType)}
                        onAddComment={(body, type) => onAddComment(solution.id, body, type)}
                        onDeleteComment={onDeleteComment}
                        onUpdateComment={onUpdateComment}
                        onToggleStatus={() => onToggleStatus(solution.id)}
                        isAdmin={isAdmin}
                        commentLoader={commentLoader}
                        operable={operable}
                        userProfile={userProfile}
                        navigate={navigate}
                    />
                ))}
            </div>
        </div>
    )
}

function SolutionCard({ 
    solution, 
    onVote, 
    onAddComment, 
    onDeleteComment, 
    onUpdateComment, 
    onToggleStatus,
    isAdmin,
    commentLoader,
    operable,
    userProfile,
    navigate
}) {
    const [showComments, setShowComments] = useState(false)
    
    const role = userProfile?.roles
    const isOwner = userProfile?.username === solution.authorUsername
    const canVote    = role === "VERIFIED_USER"                    // backend: VoteController
    const canComment = role === "USER" || role === "VERIFIED_USER" // backend: CommentController
    const canToggleStatus = operable && !isAdmin  // operable already implies authenticated ownership
    const isVerified = solution.status === 'VERIFIED'

    const handleEdit = () => {
        navigate(`/question/${solution.errorReportId || solution.postId}/solution/submit`, { state: { solution } })
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this solution?")) {
            await apiCall.deleteAnswer(solution.id, setLoading)
            window.location.reload()
        }
    }

    return (
        <article className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm relative">
            
            {/* Action Menu for Edit/Delete */}
            <div className="absolute top-2 right-2 z-10">
                                                <ActionMenu
                    operable={isOwner && !isAdmin && solution.status !== "VERIFIED"}
                    canReport={!isOwner && canComment && !isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onReport={() => {}}
                    isDark={false}
                />
            </div>

            {/* Header */}
            <div className={`p-6 border-b border-outline-variant flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${isVerified ? 'bg-brand-50/50' : ''}`}>
                <div className="flex items-center gap-4">
                    <div 
                        className="w-10 h-10 rounded-full bg-surface-variant border border-outline flex items-center justify-center font-bold text-on-surface cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate(`/profile/${solution.authorUsername}`)}
                    >
                        {solution.authorUsername?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h4 
                            className="font-bold text-on-surface cursor-pointer hover:underline"
                            onClick={() => navigate(`/profile/${solution.authorUsername}`)}
                        >
                            @{solution.authorUsername}
                        </h4>
                        <p className="text-[10px] text-on-surface-variant font-medium">{solution.createdAt || solution.updatedAt}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:pr-8">
                    {/* Status Toggle / Badge */}
                    {(isVerified || canToggleStatus) && (
                        <div className="flex items-center">
                            {isVerified ? (
                                <span className="flex items-center gap-1 text-primary font-bold text-label-md">
                                    <FaCheckCircle className="text-[18px]" />
                                    Verified Solution
                                </span>
                            ) : canToggleStatus ? (
                                <button 
                                    className="flex items-center gap-1 text-on-surface-variant hover:text-primary font-bold text-label-md transition-colors"
                                    onClick={onToggleStatus}
                                >
                                    <FaCheck className="text-[16px]" /> Mark as verified
                                </button>
                            ) : null}
                        </div>
                    )}

                    {/* Voting Box */}
                    <div className="flex items-center bg-surface-container rounded-lg px-2 py-1 gap-2 border border-outline-variant shrink-0">
                                                                        <button 
                            className={`transition-colors ${solution.voteType === 'UPVOTE' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} ${!canVote ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => canVote ? onVote('UPVOTE') : null}
                            disabled={!canVote}
                        >
                            <FaThumbsUp className="text-[16px]" />
                        </button>
                        <span className="font-bold text-label-md text-on-surface min-w-[20px] text-center">
                            {solution.score || 0}
                        </span>
                        <button 
                            className={`transition-colors ${solution.voteType === 'DOWNVOTE' ? 'text-error' : 'text-on-surface-variant hover:text-error'} ${!canVote ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => canVote ? onVote('DOWNVOTE') : null}
                            disabled={!canVote}
                        >
                            <FaThumbsDown className="text-[16px]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {solution.probableCause && (
                    <div className="space-y-1">
                        <span className="text-label-sm font-bold text-primary uppercase tracking-widest">Probable Cause</span>
                        <p className="text-on-surface text-body-md whitespace-pre-wrap">{solution.probableCause}</p>
                    </div>
                )}
                
                <div className="space-y-1">
                    <span className="text-label-sm font-bold text-primary uppercase tracking-widest">Explanation</span>
                    <p className="text-on-surface text-body-md whitespace-pre-wrap">{solution.body}</p>
                </div>

                {solution.codeChange && (
                    <div>
                        <span className="text-label-sm font-bold text-primary uppercase tracking-widest block mb-2">Code Change</span>
                        <pre className="bg-[#18181b] border border-[#3f3f46] rounded-lg p-4 font-mono overflow-x-auto text-[#e4e4e7] text-[14px]">
                            <code>{solution.codeChange}</code>
                        </pre>
                    </div>
                )}
            </div>

            {/* Comments Toggle */}
            <div className="bg-surface-container p-4 border-t border-outline-variant">
                <button 
                    className="text-label-md font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity"
                    onClick={() => setShowComments(!showComments)}
                >
                    <FaRegComments className="text-[18px]" />
                    {showComments ? "Hide Comments" : `Show Comments (${solution.comments?.length || 0})`}
                    {showComments ? <FaChevronUp className="text-[12px] ml-1" /> : <FaChevronDown className="text-[12px] ml-1" />}
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="p-4 sm:p-6 bg-surface-container-lowest border-t border-outline-variant">
                                    <DiscussionSection 
                        comments={solution.comments || []}
                        onAddComment={onAddComment}
                        onDeleteComment={onDeleteComment}
                        onUpdateComment={onUpdateComment}
                        commentLoader={commentLoader}
                    />
                </div>
            )}
        </article>
    )
}
