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

export default function QuestionDetailPage() {
    const { encryptedPostId } = useParams()
    const { userProfile } = useUserContext()
    const [question, setQuestion] = useState(null)
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [commentLoader, setCommentLoader] = useState(false)

    const postId = helperFunctions.decryptNavId(encryptedPostId)

    useEffect(() => {
        fetchQuestion()
    }, [postId])

    const fetchQuestion = async () => {
        const data = await apiCall.getQuestionDetails(postId, setLoading, setQuestion)
    }

    // ── Vote handler ──
    const handleVote = async (targetPostId, voteType) => {
        await apiCall.submitVote({ postId: targetPostId, voteType }, setLoading)
        await fetchQuestion()
    }

    // ── Comment handlers ──
    const handleAddComment = async (targetPostId, body) => {
        await apiCall.postComment({ postId: targetPostId, body }, setCommentLoader)
        await fetchQuestion()
    }

    const handleDeleteComment = async (commentId) => {
        await apiCall.deleteComment(commentId, setLoading)
        await fetchQuestion()
    }

    const handleUpdateComment = async (commentId, body) => {
        console.log(commentId, body);

        await apiCall.updateComment(commentId, body, setCommentLoader)
        await fetchQuestion()
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
    const isLoggedIn = !!userProfile?.username
    const canAnswer = isLoggedIn && !isClosed && !question.operable

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
                    isLoggedIn={isLoggedIn}
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
                {question.answers?.length > 0 && (
                    <AnswersList
                        answers={question.answers}
                        onVote={handleVote}
                        onAddComment={handleAddComment}
                        onDeleteComment={handleDeleteComment}
                        onUpdateComment={handleUpdateComment}
                        onToggleStatus={handleToggleAnswerStatus}
                        isLoggedIn={isLoggedIn}
                        commentLoader={commentLoader}
                        operable={question.operable}
                        setLoading={setLoading}
                        onOperationSuccess={async () => {
                            await fetchQuestion()
                        }}
                    />
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