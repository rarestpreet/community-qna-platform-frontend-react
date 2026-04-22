import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useUserContext } from "../../context/userContext"
import apiCall from "../../services/apiCall"
import PageLoader from "../../components/ui/PageLoader"
import QuestionCard from "./QuestionCard"
import AnswersList from "./AnswersList"
import NavBar from "../../components/NavBar"

export default function QuestionDetailPage() {
    const { postId } = useParams()
    const { userProfile } = useUserContext()
    const [question, setQuestion] = useState(null)
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false)
    const [answerBody, setAnswerBody] = useState("")
    const [loading, setLoading] = useState()

    const isLoggedIn = !!userProfile?.username

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
        await apiCall.postComment({ postId: targetPostId, body }, setLoading)
        await fetchQuestion()
    }

    const handleDeleteComment = async (commentId) => {
        await apiCall.deleteComment(commentId, setLoading)
        await fetchQuestion()
    }

    // ── Answer handler ──
    const handleSubmitAnswer = async (e) => {
        e.preventDefault()
        if (!answerBody.trim()) return
        await apiCall.postAnswer(postId, answerBody, setLoading)
        setAnswerBody("")
        setIsAnswerModalOpen(false)
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
                    isLoggedIn={isLoggedIn}
                />

                {/* Answer This Question button */}
                {isLoggedIn && (
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
                        isLoggedIn={isLoggedIn}
                    />
                )}
            </div>

            {/* Answer Modal */}
            {isAnswerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative
                        animate-[fadeIn_150ms_ease-out]">
                        <button
                            onClick={() => setIsAnswerModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold text-xl cursor-pointer"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Write Your Answer
                        </h2>
                        <form onSubmit={handleSubmitAnswer} className="flex flex-col gap-4">
                            <textarea
                                value={answerBody}
                                onChange={(e) => setAnswerBody(e.target.value)}
                                placeholder="Share your knowledge..."
                                rows={6}
                                className="input-field resize-none"
                            />
                            <button type="submit" className="btn-primary w-full">
                                Submit Answer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}