import AnswerCard from "../../components/ui/AnswerCard"

/**
 * AnswersList — section header + list of AnswerCard components.
 * Props:
 *   - answers: FeedAnswerResponseDTO[]
 *   - onVote: (postId, voteType) => void
 *   - onAddComment: (postId, body) => void
 *   - onDeleteComment: (commentId) => void
 *   - isLoggedIn: boolean
 */
function AnswersList({ answers = [], onVote, onAddComment, onDeleteComment, onUpdateComment, onToggleStatus, isLoggedIn, isAdmin, commentLoader, operable, setLoading, onOperationSuccess }) {

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
            </h2>

            <div className="flex flex-col gap-4">
                {answers.map(answer => (
                    <AnswerCard
                        key={answer.id}
                        answer={answer}
                        onVote={(voteType) => onVote?.(answer.id, voteType)}
                        onAddComment={(body, commentType) => onAddComment?.(answer.id, body, commentType)}
                        onDeleteComment={onDeleteComment}
                        onUpdateComment={onUpdateComment}
                        onToggleStatus={() => onToggleStatus?.(answer.id)}
                        isLoggedIn={isLoggedIn}
                        isAdmin={isAdmin}
                        commentLoader={commentLoader}
                        operable={operable}
                        setLoading={setLoading}
                        onOperationSuccess={onOperationSuccess}
                    />
                ))}
            </div>
        </div>
    )
}

export default AnswersList
