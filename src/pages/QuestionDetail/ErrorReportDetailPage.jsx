import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUserContext } from "../../context/userContext"
import apiCall from "../../services/apiCall"
import PageLoader from "../../components/ui/PageLoader"
import NavBar from "../../components/NavBar"
import ErrorReportCard from "./ErrorReportCard"
import ErrorReportSidebar from "./ErrorReportSidebar"
import DiscussionSection from "./DiscussionSection"
import SolutionsList from "./SolutionsList"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"

export default function ErrorReportDetailPage() {
    const { errorReportID: id } = useParams()
    const navigate = useNavigate()
    const { userProfile } = useUserContext()
    const [question, setQuestion] = useState(null)
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
    const handleVote = async (targetPostId, parentType, voteType) => {
        await apiCall.toggleVote({ parentId: targetPostId, parentType }, voteType, setLoading)
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
            <div className="min-h-screen bg-surface-container-lowest font-sans selection:bg-primary selection:text-on-primary">
                <NavBar />
                <div className="max-w-[1280px] mx-auto px-6 py-10 flex justify-center">
                    <PageLoader text="Loading error report..." />
                </div>
            </div>
        )
    }

    if (!question || !question.id) {
        return (
            <div className="min-h-screen bg-surface-container-lowest font-sans selection:bg-primary selection:text-on-primary">
                <NavBar />
                <div className="max-w-[1280px] mx-auto px-6 py-10 text-center text-on-surface-variant font-label-md">
                    Error Report not found.
                </div>
            </div>
        )
    }

    const isClosed = question.status === "CLOSED"
    const isAdmin = userProfile?.roles === "ADMIN" || false
    const isLoggedIn = !!userProfile?.username
    const isOwner = userProfile?.username === question.authorUsername || userProfile?.username === question.author?.username || question.operable
    const canAnswer = isLoggedIn && !isClosed && !isOwner && !isAdmin

    return (
        <div className="min-h-screen bg-surface-container-lowest font-sans selection:bg-primary selection:text-on-primary">
            <NavBar />
            
            <main className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-6">
                {/* Left Column (70%) */}
                <div className="w-full md:w-[70%] space-y-8">
                    <ErrorReportCard 
                        question={question}
                        onVote={(voteType) => handleVote(question.id, 'ERROR_REPORT', voteType)}
                    />

                    <DiscussionSection 
                        comments={question.comments || []}
                        onAddComment={(body, type) => handleAddComment(question.id, body, type)}
                        onDeleteComment={handleDeleteComment}
                        onUpdateComment={handleUpdateComment}
                        isLoggedIn={isLoggedIn}
                        commentLoader={commentLoader}
                        isOwner={userProfile?.username === question.author?.username}
                        isAdmin={isAdmin}
                    />

                    {solutions?.length > 0 && (
                        <SolutionsList 
                            solutions={solutions}
                            onVote={(solutionId, voteType) => handleVote(solutionId, 'SOLUTION', voteType)}
                            onAddComment={handleAddComment}
                            onDeleteComment={handleDeleteComment}
                            onUpdateComment={handleUpdateComment}
                            onToggleStatus={handleToggleAnswerStatus}
                            isLoggedIn={isLoggedIn}
                            isAdmin={isAdmin}
                            commentLoader={commentLoader}
                            operable={question.operable}
                            setLoading={setLoading}
                        />
                    )}
                    {isFetchingMoreAnswers && (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}
                </div>

                {/* Right Column (30%) */}
                <div className="w-full md:w-[30%] space-y-8">
                    <ErrorReportSidebar 
                        question={question} 
                        canAnswer={canAnswer}
                        onRefresh={() => fetchQuestion()}
                        postId={id}
                    />
                </div>
            </main>
        </div>
    )
}
