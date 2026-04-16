import { FaUserCircle, FaRegClock, FaTag } from "react-icons/fa";
import VoteBox from "./VoteBox";
import StatusBadge from "./StatusBadge";
import CommentsSection from "./CommentsSection";

export default function QuestionCard({ question, userProfile }) {
    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex gap-5">
            <VoteBox score={question.score} voted={question.hasVoted} userProfile={userProfile} />

            <div className="flex-1 min-w-0">
                {/* Title + status badge */}
                <div className="flex flex-wrap items-start gap-2 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 leading-snug flex-1 min-w-0">
                        {question.title}
                    </h1>
                    <StatusBadge status={question.postStatus} />
                </div>

                {/* Author + date */}
                <div className="flex items-center gap-3 mb-5 text-sm text-gray-500">
                    <FaUserCircle className="text-gray-300 text-2xl" />
                    <span className="font-semibold text-gray-600">Author #{question.authorId}</span>
                    <span className="flex items-center gap-1 text-xs">
                        <FaRegClock /> {question.createdAt}
                    </span>
                </div>

                {/* Body */}
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{question.body}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-5">
                    {question.tags.map(tag => (
                        <div key={tag.tagId} className="group relative">
                            <span className="flex items-center gap-1.5 rounded-md px-2.5 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider cursor-help shadow-sm">
                                <FaTag className="text-[10px]" />{tag.name}
                            </span>
                            <div className="absolute top-full mt-2 left-0 hidden group-hover:block bg-gray-800 text-white text-xs px-3 py-1.5 rounded shadow-lg z-20 w-max max-w-[200px] leading-relaxed
                                after:content-[''] after:absolute after:bottom-full after:left-4 after:border-4 after:border-transparent after:border-b-gray-800">
                                {tag.description}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comments */}
                <CommentsSection postId={question.postId} comments={question.comments} userProfile={userProfile} />
            </div>
        </section>
    );
}
