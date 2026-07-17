import React, { useState } from 'react'
import { 
    FaPlus, 
    FaShareAlt, 
    FaLink, 
    FaTerminal,
    FaCircle,
    FaCodeBranch,
    FaRegCheckCircle
} from 'react-icons/fa'
import { useNavigate } from "react-router-dom"

export default function ErrorReportSidebar({ question, canAnswer, onRefresh, postId }) {
    const navigate = useNavigate()

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        // could show a toast here
    }

    return (
        <aside className="space-y-8 sticky top-24">
            {/* Primary Action */}
            {canAnswer && (
                <>
                    <button 
                        onClick={() => navigate(`/question/${postId}/solution/submit`)}
                        className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl font-headline-sm font-bold shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <FaRegCheckCircle className="text-[20px]" />
                        Submit Solution
                    </button>
                </>
            )}

            {/* Stats Card */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
                <h3 className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant pb-2">
                    Status & Metrics
                </h3>
                <div className="flex justify-between items-center">
                    <span className="text-body-sm text-on-surface-variant">Current Score</span>
                    <span className={`font-display text-headline-lg font-black ${question.score >= 0 ? 'text-primary' : 'text-error'}`}>
                        {question.score > 0 ? '+' : ''}{question.score || 0}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-body-sm text-on-surface-variant">Status</span>
                    <span className={`flex items-center gap-1 font-bold text-label-md ${question.status === 'CLOSED' ? 'text-on-surface-variant' : 'text-primary'}`}>
                        {question.status === 'CLOSED' ? (
                            <>Closed</>
                        ) : (
                            <>
                                <FaCircle className="text-[8px] animate-pulse" />
                                Open
                            </>
                        )}
                    </span>
                </div>
                
                {/* Share/Link - temporarily hidden
                <div className="pt-2 flex gap-2">
                    <button 
                        className="flex-1 flex items-center justify-center gap-1 bg-surface-container py-2 rounded-xl text-label-md font-bold text-on-surface hover:bg-outline-variant transition-colors border border-outline-variant"
                        onClick={() => {}} // Could implement native share API
                    >
                        <FaShareAlt className="text-[16px]" /> Share
                    </button>
                    <button 
                        className="flex-1 flex items-center justify-center gap-1 bg-surface-container py-2 rounded-xl text-label-md font-bold text-on-surface hover:bg-outline-variant transition-colors border border-outline-variant"
                        onClick={handleCopyLink}
                    >
                        <FaLink className="text-[16px]" /> Link
                    </button>
                </div>
                */}
            </div>

            {/* Repo Info */}
            {(question.repositoryUrl || question.branch || question.commitHash || question.filePath) && (
                <div className="bg-surface border border-outline-variant rounded-xl p-6 space-y-3 shadow-sm">
                    <h3 className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant pb-2">
                        Repository
                    </h3>
                    
                    {question.repositoryUrl && (
                        <div className="flex items-start gap-2">
                            <FaTerminal className="text-primary mt-1 shrink-0" />
                            <a 
                                className="text-on-surface font-medium hover:underline hover:text-primary break-all text-sm" 
                                href={question.repositoryUrl.startsWith('http') ? question.repositoryUrl : `https://${question.repositoryUrl}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {question.repositoryUrl.replace(/^https?:\/\/(www\.)?(github\.com\/)?/, '')}
                            </a>
                        </div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-on-surface-variant font-medium pt-1">
                        {question.branch && (
                            <span className="flex items-center gap-1">
                                <FaCodeBranch className="text-[12px]" /> 
                                {question.branch}
                            </span>
                        )}
                        {question.commitHash && (
                            <span className="flex items-center gap-1 font-mono bg-surface-container-high px-1.5 py-0.5 rounded">
                                {question.commitHash.substring(0, 7)}
                            </span>
                        )}
                    </div>
                    {question.filePath && (
                        <div className="text-[11px] text-on-surface-variant font-medium pt-1 border-t border-outline-variant/50">
                            <span className="font-semibold text-on-surface">File:</span> {question.filePath}
                        </div>
                    )}
                </div>
            )}

            {/* Author Profile */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
                <h3 className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant pb-2 mb-4">
                    Author
                </h3>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-variant overflow-hidden rotate-2 border border-outline-variant flex items-center justify-center text-xl font-bold text-on-surface">
                        {question.authorUsername?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-on-surface">@{question.authorUsername}</h4>
                        {/* We don't have author's role/title in the question DTO by default, could use reputation if available */}
                    </div>
                </div>
                <button 
                    className="w-full py-2 border border-outline-variant rounded-xl text-label-md font-bold text-on-surface hover:bg-surface-container transition-colors"
                    onClick={() => navigate(`/profile/${question.authorUsername}`)}
                >
                    View Profile
                </button>
            </div>
        </aside>
    )
}
