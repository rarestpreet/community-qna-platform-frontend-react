import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { FaQuestionCircle, FaCommentDots, FaEdit } from "react-icons/fa"
import { useUserProfileContext } from "../../context/userProfileContext"
import apiCall from "../../services/apiCall"
import ProfileHeader from "./ProfileHeader"
import ProfileTabContent from "./ProfileTabContent"
import { useUserContext } from "../../context/userContext"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"
import EditProfilePage from "./EditProfilePage"
import VerifyEmailPage from "./VerifyEmailPage"
import ResetPasswordPage from "./ResetPasswordPage"

/**
 * AnswerCard — individual answer with vote box, body, and comments.
 *   - userProfile: {}
 *   - userQuestions: []
 *   - userAnswers: []
 *   - userComments: []
 */

export default function UserProfilePage() {
    const { username } = useParams()
    const [searchParams] = useSearchParams()
    const queryTab = searchParams.get("tab")

    const [loading, setLoading] = useState(false)
    const [userProfile, setUserProfile] = useState({})
    const [activeTab, setActiveTab] = useState("questions")
    const [tabLoading, setTabLoading] = useState(false)
    const [isFetchingMore, setIsFetchingMore] = useState(false)

    const [userQuestions, setUserQuestions] = useState([])
    const [userAnswers, setUserAnswers] = useState([])
    const [userComments, setUserComments] = useState([])

    const [limit] = useState(5)
    const [offsets, setOffsets] = useState({ questions: 0, answers: 0, comments: 0 })
    const [hasMore, setHasMore] = useState({ questions: true, answers: true, comments: true })

    useEffect(() => {
        const fetchUserProfile = async () => {
            await apiCall.getUserProfile(username, setLoading, setUserProfile)
        }
        fetchUserProfile()
    }, [username])

    useEffect(() => {
        if (activeTab === "questions" && userQuestions.length === 0) fetchUserQuestions(true)
        else if (activeTab === "answers" && userAnswers.length === 0) fetchUserAnswers(true)
        else if (activeTab === "comments" && userComments.length === 0) fetchUserComments(true)
    }, [activeTab, username])

    const fetchUserQuestions = async (isInitial = false) => {
        const currentOffset = isInitial ? 0 : offsets.questions
        isInitial ? setTabLoading(true) : setIsFetchingMore(true)

        const response = await apiCall.getUserQuestion(username, limit, currentOffset)
        if (response && response.data) {
            setUserQuestions(prev => isInitial ? response.data : [...prev, ...response.data])
            setOffsets(prev => ({ ...prev, questions: currentOffset + limit }))
            setHasMore(prev => ({ ...prev, questions: response.pageData.hasMore }))
        }

        isInitial ? setTabLoading(false) : setIsFetchingMore(false)
    }

    const fetchUserAnswers = async (isInitial = false) => {
        const currentOffset = isInitial ? 0 : offsets.answers
        isInitial ? setTabLoading(true) : setIsFetchingMore(true)

        const response = await apiCall.getUserAnswer(username, limit, currentOffset)
        if (response && response.data) {
            setUserAnswers(prev => isInitial ? response.data : [...prev, ...response.data])
            setOffsets(prev => ({ ...prev, answers: currentOffset + limit }))
            setHasMore(prev => ({ ...prev, answers: response.pageData.hasMore }))
        }

        isInitial ? setTabLoading(false) : setIsFetchingMore(false)
    }

    const fetchUserComments = async (isInitial = false) => {
        const currentOffset = isInitial ? 0 : offsets.comments
        isInitial ? setTabLoading(true) : setIsFetchingMore(true)

        const response = await apiCall.getUserComment(username, limit, currentOffset)
        if (response && response.data) {
            setUserComments(prev => isInitial ? response.data : [...prev, ...response.data])
            setOffsets(prev => ({ ...prev, comments: currentOffset + limit }))
            setHasMore(prev => ({ ...prev, comments: response.pageData.hasMore }))
        }

        isInitial ? setTabLoading(false) : setIsFetchingMore(false)
    }

    const handleTabChange = (tab) => {
        if (activeTab === tab) return
        setActiveTab(tab)
    }

    const loadMore = () => {
        if (activeTab === "questions") fetchUserQuestions(false)
        else if (activeTab === "answers") fetchUserAnswers(false)
        else fetchUserComments(false)
    }

    useInfiniteScroll(loadMore, hasMore[activeTab], isFetchingMore)

    const tabConfig = [
        { key: "questions", label: "Questions", icon: FaQuestionCircle },
        { key: "answers", label: "Answers", icon: FaCommentDots },
        { key: "comments", label: "Comments", icon: FaEdit },
    ]

    if (queryTab === "edit") return <EditProfilePage />
    if (queryTab === "verify-email") return <VerifyEmailPage />
    if (queryTab === "reset-password") return <ResetPasswordPage />

    return (
        <main className="flex-1 h-full bg-background pb-12 overflow-y-auto">
            <header className="pt-20">
                <div className="max-w-5xl mx-auto px-4 md:px-8 relative">
                    <ProfileHeader
                        profile={userProfile}
                        username={username}
                        onChangePassword={() => { }}
                        onVerifyEmail={() => { }}
                    />
                </div>
            </header>

            <section className="max-w-5xl mx-auto px-4 md:px-8 mt-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <div className="bg-surface-container-low rounded-xl shadow-sm border border-surface-container p-6 flex flex-col items-center justify-center text-center">
                        <FaQuestionCircle className="text-primary text-2xl mb-2" />
                        <span className="text-2xl font-bold text-on-surface">{userProfile?.questionCount || userQuestions.length || 0}</span>
                        <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mt-1">Questions</span>
                    </div>
                    <div className="bg-surface-container-low rounded-xl shadow-sm border border-surface-container p-6 flex flex-col items-center justify-center text-center">
                        <FaCommentDots className="text-secondary text-2xl mb-2" />
                        <span className="text-2xl font-bold text-on-surface">{userProfile?.answerCount || userAnswers.length || 0}</span>
                        <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mt-1">Answers</span>
                    </div>
                    <div className="bg-surface-container-low rounded-xl shadow-sm border border-surface-container p-6 flex flex-col items-center justify-center text-center">
                        <FaEdit className="text-tertiary text-2xl mb-2" />
                        <span className="text-2xl font-bold text-on-surface">{userProfile?.commentCount || userComments.length || 0}</span>
                        <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mt-1">Comments</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0 bg-surface-container-low rounded-xl shadow-sm border border-surface-container p-6">

                        {/* Tab bar */}
                        <div className="flex border-b border-surface-container gap-8 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {tabConfig.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => handleTabChange(key)}
                                    className={`relative py-4 text-[15px] font-semibold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer 
                                        ${activeTab === key ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
                                >
                                    <Icon className="text-base" />
                                    <span>{label}</span>
                                    {activeTab === key && (
                                        <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-primary" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="mt-6">
                            <ProfileTabContent
                                activeTab={activeTab}
                                questions={userQuestions}
                                answers={userAnswers}
                                comments={userComments}
                                loading={tabLoading}
                            />
                            {isFetchingMore && (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}