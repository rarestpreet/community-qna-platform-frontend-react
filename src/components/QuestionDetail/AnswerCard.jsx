import { FaUserCircle, FaRegClock } from "react-icons/fa";
import VoteBox from "./VoteBox";
import StatusBadge from "./StatusBadge";
import CommentsSection from "./CommentsSection";
import { useUserContext } from "../../context/userContext";

export default function AnswerCard({ answer, onSuccess }) {
    const { userProfile } = useUserContext()
    return (
        <div className={`bg-white rounded-2xl border shadow-sm p-6 flex gap-5
            ${answer.status === "ACCEPTED" ? "border-blue-200 shadow-blue-50" : "border-gray-100"}`}
        >
            <VoteBox score={answer.score} voted={answer.voted} />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                    <FaUserCircle className="text-gray-300 text-2xl" />
                    <span className="text-sm font-semibold text-gray-600">Author #{answer.authorId}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 ml-1">
                        <FaRegClock />{answer.createdAt}
                    </span>
                    <div className="ml-auto">
                        <StatusBadge status={answer.status} />
                    </div>
                </div>

                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{answer.body}</p>

                <CommentsSection
                    postId={answer.postId}
                    comments={answer.comments}
                    userProfile={userProfile}
                    onSuccess={onSuccess}
                />
            </div>
        </div>
    );
}
