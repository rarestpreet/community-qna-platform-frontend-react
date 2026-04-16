import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaComment, FaReply } from "react-icons/fa";
import PageNavBar from "../../components/ui/PageNavBar";
import QuestionCard from "../../components/QuestionDetail/QuestionCard";
import AnswerCard from "../../components/QuestionDetail/AnswerCard";
import AnswerModal from "../../components/QuestionDetail/AnswerModal";
import apiCall from "../../services/apiCall";
import { useUserContext } from "../../context/userContext";
import PageLoader from "../../components/ui/PageLoader";
import EmptyState from "../../components/ui/EmptyState";

export default function QuestionDetailPage() {
    const { postId } = useParams();
    const { userProfile, setLoading, loading } = useUserContext()
    const [questionDetail, setQuestionDetail] = useState(null)
    const [showAnswerForm, setShowAnswerForm] = useState(false);

    useEffect(() => {
        const getQuestion = async () => {
            const response = await apiCall.getQuestionDetails(postId, setLoading)

            setQuestionDetail(response)
        }
        getQuestion()
    }, [])

    if (loading || !questionDetail) {
        return (
            <div className="min-h-screen bg-slate-50">
                <PageNavBar />
                <PageLoader text="Loading question details..." />
            </div>
        )
    }

    const answersList = questionDetail.answers || questionDetail.answer || [];

    return (
        <div className="min-h-screen bg-slate-50">
            <PageNavBar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
                <QuestionCard question={questionDetail} userProfile={userProfile} />

                {/* Answer Button */}
                {userProfile?.username && (
                    <div className="flex justify-center">
                        <button
                            id="btn-post-answer"
                            onClick={() => setShowAnswerForm(true)}
                            className="btn-primary px-8 py-3 text-base"
                        >
                            <FaReply /> Answer This Question
                        </button>
                    </div>
                )}

                {showAnswerForm && (
                    <AnswerModal
                        parentPostId={questionDetail.postId}
                        onClose={() => setShowAnswerForm(false)}
                    />
                )}

                <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FaComment className="text-brand-500" />
                        {answersList.length} Answer{answersList.length !== 1 ? "s" : ""}
                    </h2>

                    <div className="flex flex-col gap-5">
                        {answersList.length > 0 ? (
                            answersList.map(answer => (
                                <AnswerCard key={answer.postId} answer={answer} />
                            ))
                        ) : (
                            <EmptyState
                                icon={FaComment}
                                title="No Answers Yet"
                                message="No one has answered this question yet. Be the first to help out!"
                            />
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
}
