import VoteBox from "../../components/ui/VoteBox"
import TagPill from "../../components/ui/TagPill"
import Badge from "../../components/ui/Badge"
import CommentsList from "../../components/ui/CommentsList"
import { useNavigate } from "react-router-dom"

/**
 * QuestionCard — the main question display with vote box, title, body, tags, and comments.
 * Props:
 *   - question: QuestionPostResponseDTO{
    answers: PostAnswerResponseDTO[],
    authorUsername: "",
    body: "",
    comments: CommentResponseDTO[],
    voted: false,
    voteType: "",
    operable: false,
    postId: 0,
    postStatus: "",
    score: 0,
    tags: TagResponseDTO[],
    title: "",
    updatedAt: ""
    }
 *   - onVote: (voteType) => void
 *   - onAddComment: (body) => void
 *   - onDeleteComment: (commentId) => void
 *   - isLoggedIn: boolean
 */
function QuestionCard({ question, onVote, onAddComment, onDeleteComment, isLoggedIn, commentLoader }) {
    const navigate = useNavigate()

    return (
        <div className="card p-6 flex gap-4">
            {/* Vote column */}
            <VoteBox
                score={question.score}
                hasVoted={question.voted}
                voteType={question.voteType}
                onVote={onVote}
                disabled={!isLoggedIn}
                operable={question.operable}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {question.title}
                    </h1>
                    <Badge status={question.postStatus} />
                </div>

                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                    {question.body}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags?.map(tag => (
                        <TagPill key={tag.tagId} tag={tag} variant="display" />
                    ))}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-end gap-2 text-xs font-medium text-gray-400">
                    <div className="flex flex-col gap-1 items-end">
                        <span className="text-gray-500">
                            Author: <span className="text-gray-700 font-semibold">{question.authorUsername}</span>
                        </span>
                        <span className="text-gray-500">
                            Modified at: <span className="text-gray-700 font-semibold">{question.updatedAt}</span>
                        </span>
                    </div>
                    <div
                        className="w-8 h-8 bg-black text-white font-medium text-lg rounded-full
                            flex justify-center items-center cursor-pointer shadow select-none
                            hover:ring-2 hover:ring-brand-300 transition-all"
                        onClick={() => navigate(`/profile/${question.authorUsername}`)}
                    >
                        {question.authorUsername[0].toUpperCase()}
                    </div>
                </div>

                {/* Comments */}
                <CommentsList
                    comments={question.comments || []}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                    isLoggedIn={isLoggedIn}
                    commentLoader={commentLoader}
                />
            </div>
        </div>
    )
}

export default QuestionCard
