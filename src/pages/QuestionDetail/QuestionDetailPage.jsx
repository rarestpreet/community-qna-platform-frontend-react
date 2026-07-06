import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useUserContext } from "../../context/userContext"
import apiCall from "../../services/apiCall"
import PageLoader from "../../components/ui/PageLoader"
import QuestionCard from "./QuestionCard"
import AnswersList from "./AnswersList"
import NavBar from "../../components/NavBar"
import helperFunctions from "../../services/helperFunctions"
import AnswerModal from "../../components/ui/AnswerModal"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"
import useRoleAction from "../../hooks/useRoleAction"

export default function QuestionDetailPage() {
    const { encryptedPostId } = useParams()
    const { userProfile } = useUserContext()
    const { requireRole } = useRoleAction()
    const [question, setQuestion] = useState(null)
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [commentLoader, setCommentLoader] = useState(false)

    const [limit] = useState(5)
    const [offset, setOffset] = useState(0)
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true)
    const [isFetchingMoreAnswers, setIsFetchingMoreAnswers] = useState(false)
    const [answers, setAnswers] = useState([])

    const postId = helperFunctions.decryptNavId(encryptedPostId)

    useEffect(() => {
        fetchQuestion(true)
    }, [postId])

    const fetchQuestion = async (isInitial = false) => {
        const fetchLimit = isInitial ? limit : (offset === 0 ? limit : offset)
        const data = await apiCall.getQuestionDetails(postId, fetchLimit, 0, setLoading)
        if (data) {
            setQuestion(data)
            setAnswers(data.answers || [])
            setHasMoreAnswers(data.hasMoreAnswers)
            if (isInitial) setOffset(limit)
        }
    }

    const loadMoreAnswers = async () => {
        if (!hasMoreAnswers || isFetchingMoreAnswers) return
        setIsFetchingMoreAnswers(true)
        const response = await apiCall.getPostAnswers(postId, limit, offset)
        if (response && response.data) {
            setAnswers(prev => {
                const existingIds = new Set(prev.map(a => a.postId))
                const newAnswers = response.data.filter(a => !existingIds.has(a.postId))
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
        requireRole(["VERIFIED_USER", "ADMIN"], async () => {
            await apiCall.submitVote({ postId: targetPostId, voteType }, setLoading)
            await fetchQuestion()
        })
    }

    // ── Comment handlers ──
    const handleAddComment = async (targetPostId, body) => {
        let result = null
        requireRole(["USER", "VERIFIED_USER", "ADMIN"], async () => {
            result = await apiCall.postComment({ postId: targetPostId, body }, setCommentLoader)
            await fetchQuestion()
        })
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
        await apiCall.toggleAnswerStatus({ questionId: question.postId, answerId: answerId }, setLoading)
        await fetchQuestion()
    }

    if (loading && !question) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NavBar />
                <div className="max-w-3xl mx-auto px-4 py-10">
                    <PageLoader text="Loading question..." />
                </div>
            </div>
        )
    }

    if (!question || !question.postId) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NavBar />
                <div className="max-w-3xl mx-auto px-4 py-10 text-center text-gray-500">
                    Question not found.
                </div>
            </div>
        )
    }

    const isClosed = question.postStatus === "CLOSED"
    const isAdmin = userProfile?.roles === "ADMIN"
    const canAnswer = !isClosed && !question.operable // "Answer This Question" button is visible to all unless closed/operable (owned by them)

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
                {/* Question */}
                <QuestionCard
                    question={question}
                    onVote={(voteType) => handleVote(question.postId, voteType)}
                    onAddComment={(body) => handleAddComment(question.postId, body)}
                    onDeleteComment={handleDeleteComment}
                    onUpdateComment={handleUpdateComment}
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
                            onClick={() => requireRole(["VERIFIED_USER", "ADMIN"], () => setIsAnswerModalOpen(true))}
                            className="btn-primary text-lg px-8 py-3"
                        >
                            Answer This Question
                        </button>
                    </div>
                )}

                {/* Answers */}
                {answers?.length > 0 && (
                    <AnswersList
                        answers={answers}
                        onVote={handleVote}
                        onAddComment={handleAddComment}
                        onDeleteComment={handleDeleteComment}
                        onUpdateComment={handleUpdateComment}
                        onToggleStatus={handleToggleAnswerStatus}
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
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
                    postId={postId}
                />
            )}
        </div>
    )
}