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
                    const navigateTo = helperFunctions.encryptNavId(q.navigationPostId)

                    return (
                        <div
                            key={q.i}
                            className="flex flex-col md:flex-row gap-5 items-start bg-surface-container-lowest
                                   border border-outline-variant/20 rounded-2xl p-3
                                   hover:border-primary/40 hover:shadow-md
                                   transition-all duration-200 cursor-pointer group"
                            onClick={() => navigate(`/question/${navigateTo}`)}
                        >
                            {/* Vote / Status badges */}
                            <div className="flex md:flex-col gap-2 min-w-[72px]">
                                <div className="bg-primary-container text-on-primary-container px-3 py-2 rounded-xl text-center flex-1 md:flex-none">
                                    <div className="text-lg font-black leading-none">{q.score ?? 0}</div>
                                    <div className="text-[9px] uppercase font-bold tracking-tighter mt-0.5">Votes</div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                    {q.title}
                                </h2>
                                <span className="text-gray-500 text-xs">
                                    Asked: <span className="text-gray-700 font-semibold">{q.updatedAt}</span>
                                </span>
                            </div>
                            <Badge status={q.postStatus} />
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
                    const navigateTo = helperFunctions.encryptNavId(a.navigationPostId)

                    return (
                        <div
                            key={a.i}
                            className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6
                                   hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => navigate(`/question/${navigateTo}`)}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex gap-3 text-sm font-semibold text-on-surface-variant">
                                    <FaCommentDots className="text-primary mt-0.5" />
                                    Answered on: <span className="text-on-surface font-bold">{a.parentPostTitle}</span>
                                </div>
                                <Badge status={a.postStatus} />
                            </div>

                            {/* Body */}
                            <p className="text-on-surface text-sm line-clamp-2 pl-7 mb-3">{a.body}</p>

                            {/* Footer */}
                            <div className="flex items-center justify-between gap-3 pl-7 text-xs text-on-surface-variant font-medium">
                                <span className="flex items-center gap-1 text-primary bg-primary-container px-2.5 py-1 rounded-full font-bold">
                                    <FaThumbsUp className="text-[10px]" />
                                    {a.score ?? 0} score
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaClock className="text-[10px]" />
                                    {a.updatedAt}
                                </span>
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
                    const navigateTo = helperFunctions.encryptNavId(c.navigationPostId)

                    return (
                        <div
                            key={c.i}
                            className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6
                                   hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => navigate(`/question/${navigateTo}`)}
                        >
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-3">
                                <FaQuoteLeft className="text-secondary text-sm" />
                                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Commented on:</span>
                                <span className="text-sm text-on-surface line-clamp-1 font-bold">{c.postContent.substring(0, 100)}...</span>
                            </div>

                            {/* Body */}
                            <p className="text-on-surface text-sm italic border-l-4 border-primary-container pl-4 leading-relaxed">
                                {c.body}
                            </p>

                            {/* Footer */}
                            <div className="mt-3 flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                                <FaClock className="text-[10px]" />
                                {c.updatedAt}
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
