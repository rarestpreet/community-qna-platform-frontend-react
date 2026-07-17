import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useUserContext } from "../../context/userContext"
import apiCall from "../../services/apiCall"
import PageLoader from "../../components/ui/PageLoader"
import QuestionCard from "./QuestionCard"
import AnswersList from "./AnswersList"
import NavBar from "../../components/NavBar"
import AnswerModal from "../../components/ui/AnswerModal"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"

export default function QuestionDetailPage() {
    const { errorReportID: id } = useParams()
    const { userProfile } = useUserContext()
    const [question, setQuestion] = useState(null)
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [commentLoader, setCommentLoader] = useState(false)

    const [limit] = useState(5)
    const [offset, setOffset] = useState(0)
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true)
    const [isFetchingMoreAnswers, setIsFetchingMoreAnswers] = useState(false)
    const [solutions, setSolutions] = useState([])

    useEffect(() => {
        fetchQuestion(true)
    }, [id])

    const fetchQuestion = async (isInitial = false) => {
        const fetchLimit = isInitial ? limit : (offset === 0 ? limit : offset)
        const data = await apiCall.getQuestionDetails(id, fetchLimit, 0, setLoading)
        if (data) {
            setQuestion(data)
            setSolutions(data.solutions || [])
            setHasMoreAnswers(data.hasMoreSolutions)
            if (isInitial) setOffset(limit)
        }
    }

    const loadMoreAnswers = async () => {
        if (!hasMoreAnswers || isFetchingMoreAnswers) return
        setIsFetchingMoreAnswers(true)
        const response = await apiCall.getPostAnswers(id, limit, offset)
        if (response && response.data) {
            setSolutions(prev => {
                const existingIds = new Set(prev.map(a => a.id))
                const newAnswers = response.data.filter(a => !existingIds.has(a.id))
                return [...prev, ...newAnswers]
            })
            setHasMoreAnswers(response.pageData.hasMore)
            setOffset(prev => prev + limit)
        }
        setIsFetchingMoreAnswers(false)
    }

    useInfiniteScroll(loadMoreAnswers, hasMoreAnswers, isFetchingMoreAnswers)

    // ── Vote handler ──
    const handleVote = async (targetPostId, voteType) => {
        await apiCall.submitVote({ postId: targetPostId, voteType }, setLoading)
        await fetchQuestion()
    }

    // ── Comment handlers ──
    const handleAddComment = async (targetPostId, body, commentType) => {
        const result = await apiCall.postComment({ postId: targetPostId, body, commentType }, setCommentLoader)
        await fetchQuestion()
        return result
    }

    const handleDeleteComment = async (commentId) => {
        await apiCall.deleteComment(commentId, setLoading)
        await fetchQuestion()
    }

    const handleUpdateComment = async (commentId, body) => {
        const result = await apiCall.updateComment(commentId, body, setCommentLoader)
        await fetchQuestion()
        return result
    }

    const handleToggleAnswerStatus = async (answerId) => {
        await apiCall.toggleAnswerStatus({ errorReportId: question.id, solutionId: answerId }, setLoading)
        await fetchQuestion()
    }

    if (loading && !question) {
        return (
            <div className="min-h-screen bg-background">
                <NavBar />
                <div className="max-w-3xl mx-auto px-4 py-10">
                    <PageLoader text="Loading question..." />
                </div>
            </div>
        )
    }

    if (!question || !question.id) {
        return (
            <div className="min-h-screen bg-background">
                <NavBar />
                <div className="max-w-3xl mx-auto px-4 py-10 text-center text-on-surface-variant">
                    Question not found.
                </div>
            </div>
        )
    }

    const isClosed = question.status === "CLOSED"
    const isAdmin = userProfile?.roles === "ADMIN" || false
    const isLoggedIn = !!userProfile?.username
    const canAnswer = isLoggedIn && !isClosed && !question.operable && !isAdmin

    return (
        <div className="min-h-screen bg-background">
            <NavBar />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
                {/* Question */}
                <QuestionCard
                    question={question}
                    onVote={(voteType) => handleVote(question.id, voteType)}
                    onAddComment={(body, commentType) => handleAddComment(question.id, body, commentType)}
                    onDeleteComment={handleDeleteComment}
                    onUpdateComment={handleUpdateComment}
                    isLoggedIn={isLoggedIn}
                    isAdmin={isAdmin}
                    commentLoader={commentLoader}
                    onOperationSuccess={async () => {
                        await fetchQuestion()
                    }}
                />

                {/* Answer This Question button */}
                {canAnswer && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsAnswerModalOpen(true)}
                            className="btn-primary text-lg px-8 py-3"
                        >
                            Answer This Question
                        </button>
                    </div>
                )}

                {/* Answers */}
                {solutions?.length > 0 && (
                    <AnswersList
                        answers={solutions}
                        onVote={handleVote}
                        onAddComment={handleAddComment}
                        onDeleteComment={handleDeleteComment}
                        onUpdateComment={handleUpdateComment}
                        onToggleStatus={handleToggleAnswerStatus}
                        isLoggedIn={isLoggedIn}
                        isAdmin={isAdmin}
                        commentLoader={commentLoader}
                        operable={question.operable}
                        setLoading={setLoading}
                        onOperationSuccess={async () => {
                            await fetchQuestion()
                        }}
                    />
                )}
                {isFetchingMoreAnswers && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}
            </div>

            {/* Answer Modal */}
            {isAnswerModalOpen && (
                <AnswerModal
                    initialBody=""
                    onClose={async () => {
                        setIsAnswerModalOpen(false)
                        await fetchQuestion()
                    }}
                    operation="POST"
                    postId={id}
                />
            )}
        </div>
    )
}