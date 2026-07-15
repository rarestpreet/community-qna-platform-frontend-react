import VoteBox from "./VoteBox"
import CommentsList from "./CommentsList"
import ActionMenu from "../../components/ui/ActionMenu"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import AnswerModal from "./AnswerModal"
import apiCall from "../../services/apiCall"

function AnswerCard({ answer, onVote, onAddComment, onDeleteComment, onUpdateComment, onToggleStatus, isLoggedIn, isAdmin, commentLoader, operable, setLoading, onOperationSuccess }) {
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false)
    const navigate = useNavigate()
    const isAccepted = answer.status === "ACCEPTED"
    
    // Support both old body and new explanation
    const explanationText = answer.explanation || answer.body

    const handleStatusToggle = () => {
        onToggleStatus(answer.id)
    }

    return (
        <div className={`relative flex gap-4 p-5 rounded-xl border transition-all duration-200 ${isAccepted
            ? "border-l-4 border-l-brand-500 border-brand-200 bg-brand-50/30"
            : "bg-white border-gray-100 hover:border-brand-300 hover:shadow-sm"
            }`}>
            {/* Vote */}
            <div className="flex flex-col justify-between">
                <VoteBox
                    score={answer.score}
                    hasVoted={answer.voted}
                    voteType={answer.voteType}
                    onVote={onVote}
                    disabled={!isLoggedIn || isAdmin}
                    operable={answer.operable && !isAdmin}
                />
                <button
                    className={`group flex flex-col items-center justify-center rounded-xl p-2 shrink-0 transition-colors ${isAccepted ? "bg-brand-50 border-brand-100" : "bg-gray-50 border border-gray-100"
                        } ${operable && !isAdmin ? "cursor-pointer" + (!isAccepted ? " hover:bg-brand-50 hover:border-brand-100" : "") : ""
                        }`}
                    disabled={!operable || isAdmin}
                    onClick={() => handleStatusToggle()}
                >
                    <span className={`font-bold text-xl leading-none mb-1 transition-colors ${isAccepted ? "text-brand-600" : "text-black"
                        } ${operable && !isAdmin && !isAccepted ? "group-hover:text-brand-600" : ""
                        }`}>
                        {(answer.status || "?").charAt(0)}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                        Status
                    </span>
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 gap-4 min-w-0">
                {/* Environment Information (if present) */}
                {(answer.language || answer.os) && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {answer.language && (
                            <div>
                                <span className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Lang:</span>{" "}
                                {answer.language} {answer.languageVersion && <span className="text-gray-400">({answer.languageVersion})</span>}
                            </div>
                        )}
                        {answer.framework && (
                            <div>
                                <span className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Framework:</span>{" "}
                                {answer.framework} {answer.frameworkVersion && <span className="text-gray-400">({answer.frameworkVersion})</span>}
                            </div>
                        )}
                        {answer.os && (
                            <div>
                                <span className="font-semibold text-gray-500 uppercase tracking-wider text-xs">OS:</span>{" "}
                                {answer.os} {answer.osVersion && <span className="text-gray-400">({answer.osVersion})</span>}
                            </div>
                        )}
                    </div>
                )}

                {answer.probableCause && (
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">Probable Cause</h4>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{answer.probableCause}</p>
                    </div>
                )}

                <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Explanation</h4>
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap mt-1">
                        {explanationText}
                    </p>
                </div>

                {answer.codeChange && (
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">Code Change</h4>
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto font-mono">
                            {answer.codeChange}
                        </pre>
                    </div>
                )}

                <div className="flex items-center justify-end gap-2 text-xs font-medium text-gray-400 mt-2">
                    <div className="flex flex-col gap-1 items-end">
                        <span className="text-gray-500">
                            Author: <span className="text-gray-700 font-semibold">{answer.authorUsername}</span>
                        </span>
                        <span className="text-gray-500">
                            Modified at: <span className="text-gray-700 font-semibold">{answer.updatedAt}</span>
                        </span>
                    </div>
                    <div
                        className="w-8 h-8 bg-black text-white font-medium text-lg rounded-full
                            flex justify-center items-center cursor-pointer shadow select-none
                            hover:ring-2 hover:ring-brand-300 transition-all"
                        onClick={() => navigate(`/profile/${answer.authorUsername}`)}
                    >
                        {answer.authorUsername?.[0]?.toUpperCase() || "?"}
                    </div>
                </div>

                {/* Comments */}
                <CommentsList
                    postId={answer.id}
                    postType="SOLUTION"
                    comments={answer.comments || []}
                    hasMoreComments={answer.hasMoreComments}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                    onUpdateComment={onUpdateComment}
                    isLoggedIn={isLoggedIn && !isAdmin}
                    commentLoader={commentLoader}
                />
            </div>
            <div className="absolute -top-3 -right-3 z-10">
                <ActionMenu
                    isLoggedIn={isLoggedIn && !isAdmin}
                    operable={answer.operable && !isAdmin && !isAccepted}
                    canReport={!(answer.operable && !isAdmin)}
                    onEdit={() => setIsAnswerModalOpen(true)}
                    onDelete={async () => {
                        await apiCall.deleteAnswer(answer.id, setLoading)
                        onOperationSuccess()
                    }}
                />
            </div>

            {/* Answer Modal */}
            {isAnswerModalOpen && (
                <AnswerModal
                    initialSolution={answer}
                    onClose={async () => {
                        setIsAnswerModalOpen(false)
                        if (onOperationSuccess) await onOperationSuccess()
                    }}
                    operation="PUT"
                    postId={answer.id}
                />
            )}
        </div>
    )
}

export default AnswerCard
