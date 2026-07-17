import { useNavigate } from "react-router-dom"
import { FaQuestionCircle, FaCommentDots, FaEdit, FaClock, FaChevronRight, FaThumbsUp, FaQuoteLeft } from "react-icons/fa"
import TabLoader from "../../components/ui/TabLoader"
import EmptyState from "../../components/ui/EmptyState"
import Badge from "../../components/ui/Badge"
import helperFunctions from "../../services/helperFunctions"

/**
 * ProfileTabContent — renders the appropriate content for the active profile tab.
 * Props:
 *   - activeTab: "questions" | "answers" | "comments"
 *   - questions: UserQuestionResponseDTO[{
            navigationPostId: 0,
            title: "",
            score: 0,
            updatedAt: "",
            postStatus: ""
        }]
 *   - answers: UserAnswerResponseDTO[{
            body: "",
            postStatus: "",
            score: 0,
            updatedAt: "",
            navigationPostId: 0,
            parentPostTitle: "",
        }]
 *   - comments: UserCommentResponseDTO[{
            body: "",
            navigationPostId: "",
            postContent: "",
            updatedAt: ""
        }]
 *   - loading: boolean
 */
function ProfileTabContent({ activeTab, questions, answers, comments, loading }) {
    const navigate = useNavigate()

    if (activeTab === "questions") {
        if (loading) return <TabLoader rows={3} />
        if (questions.length === 0) {
            return (
                <EmptyState
                    icon={FaQuestionCircle}
                    title="No Questions Yet"
                    message="This user hasn't posted any questions."
                />
            )
        }

        return (
            <div className="flex flex-col gap-4">
                {questions.map((q, i) => {
                    const navigateTo = q.navigationId

                    return (
                        <div
                            key={i}
                            className="flex flex-col md:flex-row gap-5 items-start justify-between bg-surface
                                   border-b border-outline-variant/30 py-6 last:border-0
                                   hover:bg-surface-container-low transition-all duration-300 cursor-pointer group"
                            onClick={() => navigate(`/question/${navigateTo}`)}
                        >
                            {/* Main Content (Left) */}
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge status={q.status || q.postStatus} />
                                    <span className="text-on-surface-variant text-sm">
                                        Asked {q.updatedAt}
                                    </span>
                                </div>
                                <h2 className="text-lg font-semibold tracking-tight text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
                                    {q.title}
                                </h2>
                                <p className="text-on-surface-variant text-sm line-clamp-2 mb-3">
                                    {q.description || q.body || "No description provided."}
                                </p>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {q.tags?.map((tag, idx) => (
                                        <span key={idx} className="bg-surface-container text-on-surface px-2 py-1 rounded text-xs font-medium">
                                            {tag.name || tag}
                                        </span>
                                    ))}
                                    {(!q.tags || q.tags.length === 0) && (
                                        <span className="bg-surface-container text-on-surface px-2 py-1 rounded text-xs font-medium">java</span>
                                    )}
                                </div>
                            </div>

                            {/* Score Block (Right) */}
                            <div className="flex-shrink-0 mt-2 md:mt-0">
                                <div className="bg-primary-container text-on-primary-container px-4 py-3 rounded-lg text-center min-w-[70px]">
                                    <div className="text-xl font-bold leading-none">{q.score > 0 ? `+${q.score}` : (q.score || 0)}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider mt-1">Score</div>
                                </div>
                            </div>
                        </div>
                    )
                })
                }
            </div>
        )
    }

    if (activeTab === "answers") {
        if (loading) return <TabLoader rows={3} />
        if (answers.length === 0) {
            return (
                <EmptyState
                    icon={FaCommentDots}
                    title="No Answers Yet"
                    message="This user hasn't provided any answers."
                />
            )
        }
        return (
            <div className="flex flex-col gap-4">
                {answers.map((a, i) => {
                    const navigateTo = a.navigationId

                    return (
                        <div
                            key={i}
                            className="flex flex-col md:flex-row gap-5 items-start justify-between bg-surface
                                   border-b border-outline-variant/30 py-6 last:border-0
                                   hover:bg-surface-container-low transition-all duration-300 cursor-pointer group"
                            onClick={() => navigate(`/question/${navigateTo}`)}
                        >
                            <div className="flex-1 min-w-0 pr-4">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge status={a.status || a.postStatus} />
                                    <span className="text-on-surface-variant text-sm">
                                        Answered on {a.updatedAt}
                                    </span>
                                </div>
                                <h2 className="text-lg font-semibold tracking-tight text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-1.5 flex items-center gap-2">
                                    <FaCommentDots className="text-outline-variant shrink-0" />
                                    {a.parentReportTitle}
                                </h2>

                                {/* Body */}
                                <p className="text-on-surface-variant text-sm line-clamp-2 mb-2">{a.explanation}</p>
                            </div>
                            
                            {/* Score Block (Right) */}
                            <div className="flex-shrink-0 mt-2 md:mt-0">
                                <div className="bg-primary-container text-on-primary-container px-4 py-3 rounded-lg text-center min-w-[70px]">
                                    <div className="text-xl font-bold leading-none">{a.score > 0 ? `+${a.score}` : (a.score || 0)}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider mt-1">Score</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    if (activeTab === "comments") {
        if (loading) return <TabLoader rows={3} />
        if (comments.length === 0) {
            return (
                <EmptyState
                    icon={FaEdit}
                    title="No Comments Yet"
                    message="This user hasn't made any comments."
                />
            )
        }
        return (
            <div className="flex flex-col gap-4">
                {comments.map((c, i) => {
                    const navigateTo = c.parentId

                    return (
                        <div
                            key={i}
                            className="flex flex-col md:flex-row gap-5 items-start justify-between bg-surface
                                   border-b border-outline-variant/30 py-6 last:border-0
                                   hover:bg-surface-container-low transition-all duration-300 cursor-pointer group"
                            onClick={() => navigate(`/question/${navigateTo}`)}
                        >
                            <div className="flex-1 min-w-0">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-on-surface-variant text-sm">
                                        Commented on {c.updatedAt}
                                    </span>
                                </div>
                                <h2 className="text-sm font-semibold tracking-tight text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-2 flex items-center gap-2">
                                    <FaQuoteLeft className="text-outline-variant shrink-0 text-xs" />
                                    {c.parentType}
                                </h2>

                                {/* Body */}
                                <p className="text-on-surface text-sm italic border-l-2 border-outline-variant pl-3 leading-relaxed">
                                    {c.body}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return null
}

export default ProfileTabContent
