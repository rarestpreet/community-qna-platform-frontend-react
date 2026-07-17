import React, { useState } from 'react'
import {
    FaChevronUp,
    FaChevronDown,
    FaCode,
    FaChevronRight
} from 'react-icons/fa'
import ActionMenu from "../../components/ui/ActionMenu"
import { useNavigate } from "react-router-dom"
import apiCall from "../../services/apiCall"
import { useUserContext } from "../../context/userContext"

export default function ErrorReportCard({ question, onVote }) {
    const navigate = useNavigate()
    const { userProfile } = useUserContext()
    const [isStackOpen, setIsStackOpen] = useState(false)

    const isUrgent = question.tags?.some(t => t.name.toLowerCase() === 'urgent')

    // Derived state for operations
    const isAdmin = userProfile?.roles === "ADMIN" || false
    const isLoggedIn = !!userProfile?.username
    const isOwner = userProfile?.username === question.authorUsername

    const handleEdit = async () => {
        navigate("/ask", { state: { question } })
    }

    const handleDelete = async () => {
        apiCall.deleteQuestion(question.id)
        navigate(-1)
    }

    return (
        <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm relative">
            {/* Action Menu for Edit/Delete */}
            <div className="absolute top-2 right-2 z-10">
                <ActionMenu
                    isLoggedIn={isLoggedIn && !isAdmin}
                    operable={question.operable && !isAdmin && question.status !== "CLOSED" && question.postStatus !== "CLOSED"}
                    canReport={!(question.operable && !isAdmin)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onReport={() => { }}
                    isDark={false}
                />
            </div>

            {/* Header Info */}
            <div className="p-4 md:p-5 border-b border-outline-variant flex gap-4">
                {/* Voting Column */}
                <div className="flex flex-col items-center min-w-[40px]">
                    <button
                        className={`transition-colors ${question.voteType === 'UPVOTE' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} ${(!isLoggedIn || isAdmin || isOwner) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => (!isLoggedIn || isAdmin || isOwner) ? null : onVote('UPVOTE')}
                        disabled={!isLoggedIn || isAdmin || isOwner}
                    >
                        <FaChevronUp className="text-[28px]" />
                    </button>
                    <span className="font-bold text-headline-md text-zinc-900 -my-1">{question.score || 0}</span>
                    <button
                        className={`transition-colors ${question.voteType === 'DOWNVOTE' ? 'text-error' : 'text-on-surface-variant hover:text-error'} ${(!isLoggedIn || isAdmin || isOwner) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => (!isLoggedIn || isAdmin || isOwner) ? null : onVote('DOWNVOTE')}
                        disabled={!isLoggedIn || isAdmin || isOwner}
                    >
                        <FaChevronDown className="text-[28px]" />
                    </button>
                </div>

                <div className="flex-1 min-w-0 md:pr-4">
                    <div className="flex items-start justify-between mb-1.5">
                        <h1 className="text-[26px] font-bold text-on-surface wrap-break-word leading-snug tracking-tight">
                            {question.title}
                        </h1>
                        {isUrgent && (
                            <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-label-sm font-bold uppercase tracking-wider shrink-0 ml-4 mt-1">
                                Urgent
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-body-sm">
                        <div
                            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate(`/profile/${question.authorUsername}`)}
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary overflow-hidden flex items-center justify-center text-sm font-bold text-on-primary shadow-sm">
                                {question.authorUsername?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-[10px] font-bold text-on-surface uppercase tracking-wide">@{question.authorUsername}</span>
                        </div>
                        <span>•</span>
                        <span>{question.createdAt || question.updatedAt}</span>
                        <span>•</span>
                        <div className="flex gap-2 flex-wrap">
                            {question.language && (
                                <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant uppercase">
                                    {question.language}
                                </span>
                            )}
                            {question.framework && (
                                <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant uppercase">
                                    {question.framework}
                                </span>
                            )}
                            {question.tags?.filter(t => t.name.toLowerCase() !== 'urgent').map(tag => (
                                <span key={tag.tagId} className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant uppercase">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Description & Code */}
            <div className="p-6 space-y-6">
                <div className="prose max-w-none">
                    <p className="text-on-surface leading-relaxed text-body-md whitespace-pre-wrap">
                        {question.description || question.body}
                    </p>
                </div>

                {question.reproductionSteps && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-label-md font-bold text-primary flex items-center gap-2">
                                Reproduction Steps
                            </span>
                        </div>
                        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4">
                            <p className="text-on-surface text-sm whitespace-pre-wrap leading-relaxed">{question.reproductionSteps}</p>
                        </div>
                    </div>
                )}

                {question.relevantCode && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-label-md font-bold text-primary flex items-center gap-2">
                                <FaCode className="text-[18px]" /> Relevant Code
                            </span>
                        </div>
                        <pre className="bg-[#18181b] border border-[#3f3f46] rounded-lg p-4 font-mono overflow-x-auto text-[#e4e4e7] text-[14px]">
                            <code>{question.relevantCode}</code>
                        </pre>
                    </div>
                )}

                {/* Expandable Log */}
                {question.relevantLog && (
                    <details
                        className="group border border-outline-variant rounded-lg bg-surface-container overflow-hidden"
                        open={isStackOpen}
                        onToggle={(e) => setIsStackOpen(e.target.open)}
                    >
                        <summary className="flex items-center justify-between p-3 cursor-pointer hover:bg-surface-container-high transition-colors list-none select-none">
                            <span className="text-label-md font-bold text-on-surface flex items-center gap-2">
                                <FaChevronRight className={`transition-transform duration-200 ${isStackOpen ? 'rotate-90' : ''}`} />
                                View Stack Trace
                            </span>
                        </summary>
                        <div className="p-6 border-t border-outline-variant bg-surface-container-low text-error/80 font-mono text-sm whitespace-pre overflow-x-auto">
                            {question.relevantLog}
                        </div>
                    </details>
                )}
            </div>
        </section>
    )
}
