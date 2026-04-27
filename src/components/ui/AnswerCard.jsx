import VoteBox from "./VoteBox"
import CommentsList from "./CommentsList"
import ActionMenu from "../../components/ui/ActionMenu"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import AnswerModal from "./AnswerModal"
import apiCall from "../../services/apiCall"

/**
 * AnswerCard — individual answer with vote box, body, and comments.
 * Props:
 *   - answer: PostAnswerResponseDTO { 
    postId: 0,
    voted: false,
    voteType: "",
    authorUsername: "",
    body: "",
    updatedAt: "",
    postStatus: "",
    comments: [],
    score: 0,
    operable: false
    }
 *   - onVote: (voteType) => void
 *   - onAddComment: (body) => void
 *   - onDeleteComment: (commentId) => void
 *   - isLoggedIn: boolean
 */
function AnswerCard({ answer, onVote, onAddComment, onDeleteComment, onUpdateComment, onToggleStatus, isLoggedIn, commentLoader, operable, canToggle, setLoading, onOperationSuccess }) {
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false)
    const navigate = useNavigate()
    const isAccepted = answer.postStatus === "ACCEPTED"

    const handleStatusToggle = () => {
        onToggleStatus(answer.postId)
    }

    return (
        <div className={`relative flex gap-4 p-5 rounded-xl border transition-all duration-200 ${isAccepted
            ? "border-l-4 border-l-brand-500 border-brand-200"
            : "bg-white border-gray-100 hover:border-brand-300 hover:shadow-sm"
            }`}>
            {/* Vote */}
            <div className="flex flex-col justify-between">
                <VoteBox
                    score={answer.score}
                    hasVoted={answer.voted}
                    voteType={answer.voteType}
                    onVote={onVote}
                    disabled={!isLoggedIn}
                    operable={answer.operable}
                />
                <button
                    className={`group flex flex-col items-center justify-center rounded-xl p-2 shrink-0 transition-colors ${isAccepted ? "bg-brand-50 border-brand-100" : "bg-gray-50 border border-gray-100"
                        } ${operable && (canToggle || isAccepted) ? "cursor-pointer" + (!isAccepted ? " hover:bg-brand-50 hover:border-brand-100" : "") : ""
                        }`}
                    disabled={!(operable && (canToggle || isAccepted))}
                    onClick={() => handleStatusToggle()}
                >
                    <span className={`font-bold text-xl leading-none mb-1 transition-colors ${isAccepted ? "text-brand-600" : "text-black"
                        } ${operable && (canToggle || isAccepted) && !isAccepted ? "group-hover:text-brand-600" : ""
                        }`}>
                        {answer.postStatus.charAt(0)}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                        Status
                    </span>
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 gap-2 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap flex-1 mt-1">
                        {answer.body}
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2 text-xs font-medium text-gray-400">
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
                        {answer.authorUsername[0].toUpperCase()}
                    </div>
                </div>

                {/* Comments */}
                <CommentsList
                    comments={answer.comments || []}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                    onUpdateComment={onUpdateComment}
                    isLoggedIn={isLoggedIn}
                    commentLoader={commentLoader}
                />
            </div>
            <div className="absolute -top-3 -right-3 z-10">
                <ActionMenu
                    isLoggedIn={isLoggedIn}
                    operable={answer.operable}
                    onEdit={() => setIsAnswerModalOpen(true)}
                    onDelete={async () => {
                        await apiCall.deleteAnswer(answer.postId, setLoading)
                        onOperationSuccess()
                    }}
                />
            </div>

            {/* Answer Modal */}
            {isAnswerModalOpen && (
                <AnswerModal
                    initialBody={answer.body}
                    onClose={async () => {
                        setIsAnswerModalOpen(false)
                        if (onOperationSuccess) await onOperationSuccess()
                    }}
                    operation="PUT"
                    postId={answer.postId}
                />
            )}
        </div>
    )
}

export default AnswerCard
