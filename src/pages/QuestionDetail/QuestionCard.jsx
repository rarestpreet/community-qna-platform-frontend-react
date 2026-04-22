import VoteBox from "../../components/ui/VoteBox"
import TagPill from "../../components/ui/TagPill"
import Badge from "../../components/ui/Badge"
import CommentsList from "../../components/ui/CommentsList"

/**
 * QuestionCard — the main question display with vote box, title, body, tags, and comments.
 * Props:
 *   - question: QuestionPostResponseDTO
 *   - onVote: (voteType) => void
 *   - onAddComment: (body) => void
 *   - onDeleteComment: (commentId) => void
 *   - isLoggedIn: boolean
 */
function QuestionCard({ question, onVote, onAddComment, onDeleteComment, isLoggedIn }) {
    return (
        <div className="card p-6 flex gap-4">
            {/* Vote column */}
            <VoteBox
                score={question.score}
                hasVoted={question.hasVoted}
                onVote={onVote}
                disabled={!isLoggedIn}
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
                <div className="flex justify-end text-xs text-gray-400 font-medium mb-2">
                    updated: {question.updatedAt}
                </div>

                {/* Comments */}
                <CommentsList
                    comments={question.comments || []}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                    isLoggedIn={isLoggedIn}
                />
            </div>
        </div>
    )
}

export default QuestionCard
