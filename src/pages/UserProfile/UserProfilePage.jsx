import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FaQuestionCircle, FaCommentDots, FaEdit } from "react-icons/fa"
import { useUserProfileContext } from "../../context/userProfileContext"
import apiCall from "../../services/apiCall"
import ProfileHeader from "./ProfileHeader"
import ProfileTabContent from "./ProfileTabContent"
import { useUserContext } from "../../context/userContext"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"

/**
 * AnswerCard — individual answer with vote box, body, and comments.
 *   - userProfile: {}
 *   - userQuestions: []
 *   - userAnswers: []
 *   - userComments: []
 */

export default function UserProfilePage() {
    const { username } = useParams()

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

    return (
        <main className="flex-1 h-full bg-surface pb-12 overflow-y-auto">
            <header className="relative">
                <div className="h-48 w-full hero-gradient"></div>
                <div className="max-w-6xl mx-auto px-8 relative">
                    <ProfileHeader
                        profile={userProfile}
                        username={username}
                        onChangePassword={() => { }}
                        onVerifyEmail={() => { }}
                    />
                </div>
            </header>

            <section className="max-w-6xl mx-auto px-8 mt-4">
                <div className="mt-8 flex flex-col md:flex-row gap-8">

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="flex border-b border-outline-variant gap-8 overflow-x-auto">
                            {tabConfig.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => handleTabChange(key)}
                                    className={`relative py-4 text-sm font-medium tracking-tight flex items-center gap-2 hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer ${activeTab === key ? "text-primary" : "text-on-surface-variant"
                                        }`}
                                >
                                    <Icon className="text-base" />
                                    <span>{label}</span>
                                    {activeTab === key && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-md" />
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
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}