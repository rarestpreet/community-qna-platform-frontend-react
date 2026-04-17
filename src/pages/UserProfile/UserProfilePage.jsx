import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';
import { FaUserCircle, FaEnvelope, FaKey, FaCommentDots, FaQuestionCircle, FaCheckCircle, FaExclamationTriangle, FaEdit, FaArrowLeft, FaSignOutAlt, FaInbox, FaUserShield } from 'react-icons/fa';
import AuthInput from '../../components/ui/AuthInput';
import apiCall from '../../services/apiCall';
import TabLoader from '../../components/ui/TabLoader';
import EmptyState from '../../components/ui/EmptyState';
import PageNavBar from '../../components/ui/PageNavBar';

export default function UserProfilePage() {
    const { username } = useParams()
    const { loading, setLoading } = useUserContext()
    const navigate = useNavigate()
    const [userProfile, setUserProfile] = useState({})
    const [userQuestions, setUserQuestions] = useState([])
    const [userAnswers, setUserAnswers] = useState([])
    const [userComments, setUserComments] = useState([])


    useEffect(() => {
        const getProfile = async () => {
            const userDetails = await apiCall.getUserProfile(username, setLoading)
            setUserProfile(userDetails)
        }
        getProfile()
        getUserQuestion()

    }, [])


    const handleLogout = async () => {
        const response = await apiCall.terminateSession(setLoading, setUserProfile)

        if (response) {
            navigate("/")
        }
    }

    const getUserQuestion = async () => {
        const data = await apiCall.getUserQuestion(username, setLoading)
        setUserQuestions(Array.isArray(data) ? data : [])
    }

    const getUserComment = async () => {
        const data = await apiCall.getUserComment(username, setLoading)
        setUserComments(Array.isArray(data) ? data : [])
    }

    const getUserAnswer = async () => {
        const data = await apiCall.getUserAnswer(username, setLoading)
        setUserAnswers(Array.isArray(data) ? data : [])
    }

    const [activeTab, setActiveTab] = useState('questions');
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pb-12 flex flex-col">
            <PageNavBar title="User profile" />

            {/* Header / Cover Area */}
            <div className="w-full h-30 bg-green-500"></div>

            <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Info Card */}
                <div className="-mt-16 bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative border border-gray-100">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-green-100 flex items-center justify-center text-green-600 text-5xl shadow-md">
                            <FaUserCircle className="w-full h-full text-green-500 bg-white rounded-full" />
                        </div>
                        {userProfile.accountVerified && (
                            <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <FaCheckCircle className="text-blue-500 text-xl" title="Verified Account" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            {userProfile.username}
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" /> {userProfile.email}
                            {!userProfile.accountVerified && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                    <FaExclamationTriangle /> Unverified
                                </span>
                            )}
                        </p>
                        <div className="flex gap-4 mt-4 text-sm text-gray-600 font-medium">
                            <span className="bg-gray-100 px-3 py-1 rounded-lg">Reputation: <strong className="text-black">{userProfile.reputation}</strong></span>
                            <span className="bg-gray-100 px-3 py-1 rounded-lg">Joined {userProfile.createdAt}</span>
                        </div>
                    </div>

                    {userProfile.operable && (
                        <div className="absolute top-6 right-6 flex flex-col gap-2">
                            {userProfile.role === 'ADMIN' && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                                >
                                    <FaUserShield /> Admin Dashboard
                                </button>
                            )}
                            <button
                                onClick={() => setIsChangePasswordOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                                disabled={true}
                            >
                                <FaKey /> Change Password
                            </button>
                            {!userProfile.accountVerified && (
                                <button
                                    onClick={() => setIsVerifyEmailOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                                    disabled={true}
                                >
                                    <FaCheckCircle /> Verify Email
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="mt-8">
                    <div className="flex border-b border-gray-200 gap-8 overflow-x-auto">
                        {['questions', 'answers', 'comments'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => {
                                    if (activeTab == tab) {
                                        return
                                    }

                                    if (tab == 'questions') {
                                        getUserQuestion()
                                    }
                                    else if (tab == 'answers') {
                                        getUserAnswer()
                                    }
                                    else {
                                        getUserComment()
                                    }

                                    setActiveTab(tab)
                                }}
                                className={`whitespace-nowrap pb-4 text-lg font-semibold flex items-center gap-2 transition-colors relative cursor-pointer ${activeTab === tab
                                    ? "text-green-600"
                                    : "text-gray-500 hover:text-gray-800"
                                    }`}
                            >
                                {tab === 'questions' && <FaQuestionCircle />}
                                {tab === 'answers' && <FaCommentDots />}
                                {tab === 'comments' && <FaEdit />}
                                <span className="capitalize">{tab}</span>
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-t-md"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === 'questions' && (
                            loading ? <TabLoader rows={3} /> :
                                userQuestions.length === 0 ? (
                                    <EmptyState
                                        icon={FaQuestionCircle}
                                        title="No Questions Yet"
                                        message="This user hasn't posted any questions."
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {userQuestions.map(q => (
                                            <div key={q.postId}
                                                onClick={() => navigate(`/question/${q.postId}`)}
                                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-all duration-200 hover:shadow-md cursor-pointer hover:-translate-y-0.5">
                                                <h3 className="text-xl font-bold text-gray-900">{q.title}</h3>
                                                <div className="flex gap-4 mt-3 text-sm text-gray-500 font-medium">
                                                    <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{q.score} votes</span>
                                                    <span>{q.status} status</span>
                                                    <span>asked {q.updatedAt}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                        )}

                        {activeTab === 'answers' && (
                            loading ? <TabLoader rows={3} /> :
                                userAnswers.length === 0 ? (
                                    <EmptyState
                                        icon={FaCommentDots}
                                        title="No Answers Yet"
                                        message="This user hasn't provided any answers."
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {userAnswers.map(a => (
                                            <div key={a.postId} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors">
                                                <div className="text-sm font-semibold text-gray-500 mb-2">
                                                    Answered in: <span className="text-gray-900">{a.parentPostTitle}</span>
                                                </div>
                                                <p className="text-gray-800 line-clamp-2">{a.body}</p>
                                                <div className="flex gap-4 mt-3 text-sm text-gray-500 font-medium">
                                                    <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{a.score} votes</span>
                                                    <span>{a.updatedAt}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                        )}

                        {activeTab === 'comments' && (
                            loading ? <TabLoader rows={3} /> :
                                userComments.length === 0 ? (
                                    <EmptyState
                                        icon={FaEdit}
                                        title="No Comments Yet"
                                        message="This user hasn't made any comments."
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {userComments.map(c => (
                                            <div key={c.commentId} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors">
                                                <div className="text-sm font-semibold text-gray-500 mb-2">
                                                </div>
                                                <p className="text-gray-800 text-sm italic border-l-4 border-gray-200 pl-3">{c.body}</p>
                                                <div className="mt-3 text-xs text-gray-400 font-medium">
                                                    {c.updatedAt}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                        )}
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {isChangePasswordOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <button
                            onClick={() => setIsChangePasswordOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaKey className="text-green-500" /> Change Password
                        </h2>
                        <div className="flex flex-col gap-4">
                            <AuthInput label="Current Password" type="password" placeholder="••••••••" />
                            <AuthInput label="New Password" type="password" placeholder="••••••••" />
                            <AuthInput label="Confirm New Password" type="password" placeholder="••••••••" />
                            <button className="mt-4 w-full bg-black text-white font-bold text-lg py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-md">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verify Email Modal */}
            {isVerifyEmailOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center">
                        <button
                            onClick={() => setIsVerifyEmailOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold"
                        >
                            ✕
                        </button>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500 text-3xl">
                            <FaEnvelope />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            We'll send a verification link to <strong className="text-black">{mockUser.email}</strong>.
                            Please click the link in the email to verify your account.
                        </p>
                        <button
                            className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                            onClick={() => {
                                alert("Verification email sent! (UI Mock)");
                                setIsVerifyEmailOpen(false);
                            }}
                        >
                            Send Verification Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
