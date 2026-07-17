import VoteBox from "../../components/ui/VoteBox"
import TagPill from "../../components/ui/TagPill"
import Badge from "../../components/ui/Badge"
import CommentsList from "../../components/ui/CommentsList"
import ActionMenu from "../../components/ui/ActionMenu"
import { useNavigate } from "react-router-dom"
import apiCall from "../../services/apiCall"

function QuestionCard({ question, onVote, onAddComment, onDeleteComment, onUpdateComment, isLoggedIn, isAdmin, commentLoader, onOperationSuccess }) {
    const navigate = useNavigate()

    const handleEdit = async () => {
        navigate("/ask", { state: { question } })
    }

    const handleDelete = async () => {
        apiCall.deleteQuestion(question.id)
        navigate(-1)
    }

    return (
        <div className="card p-6 flex gap-4 relative">
            {/* Vote column */}
            <VoteBox
                score={question.score}
                hasVoted={question.voted}
                voteType={question.voteType}
                onVote={onVote}
                disabled={!isLoggedIn || isAdmin}
                operable={question.operable && !isAdmin}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {question.title}
                    </h1>
                    <div className="flex items-center gap-2">
                        <Badge status={question.postStatus || question.status} />
                    </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                    {question.description || question.body}
                </p>

                {/* Detailed Environment Fields */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">
                    <div>
                        <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider">Error Type</span>
                        {question.errorType || "N/A"}
                    </div>
                    <div>
                        <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider">Language</span>
                        {question.language || "N/A"} {question.languageVersion && <span className="text-gray-400">({question.languageVersion})</span>}
                    </div>
                    {question.framework && (
                        <div>
                            <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider">Framework</span>
                            {question.framework} {question.frameworkVersion && <span className="text-gray-400">({question.frameworkVersion})</span>}
                        </div>
                    )}
                    {question.os && (
                        <div>
                            <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider">OS</span>
                            {question.os} {question.osVersion && <span className="text-gray-400">({question.osVersion})</span>}
                        </div>
                    )}
                </div>

                {question.reproductionSteps && (
                    <div className="mb-4">
                        <h3 className="font-bold text-gray-800 text-sm mb-1">Reproduction Steps</h3>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">{question.reproductionSteps}</p>
                    </div>
                )}

                {question.repositoryUrl && (
                    <div className="mb-4 bg-brand-50 border border-brand-100 p-3 rounded-lg text-sm flex gap-x-6 gap-y-2 flex-wrap">
                        <div><span className="font-semibold text-brand-700">Repo:</span> <a href={question.repositoryUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{question.repositoryUrl}</a></div>
                        {question.branch && <div><span className="font-semibold text-brand-700">Branch:</span> {question.branch}</div>}
                        {question.commitHash && <div><span className="font-semibold text-brand-700">Commit:</span> {question.commitHash}</div>}
                        {question.filePath && <div><span className="font-semibold text-brand-700">File:</span> {question.filePath}</div>}
                    </div>
                )}

                {question.relevantCode && (
                    <div className="mb-4">
                        <h3 className="font-bold text-gray-800 text-sm mb-1">Relevant Code</h3>
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto font-mono">
                            {question.relevantCode}
                        </pre>
                    </div>
                )}

                {question.relevantLog && (
                    <div className="mb-4">
                        <h3 className="font-bold text-gray-800 text-sm mb-1">Relevant Log</h3>
                        <pre className="bg-gray-100 text-gray-800 border border-gray-300 p-3 rounded-lg text-xs overflow-x-auto font-mono">
                            {question.relevantLog}
                        </pre>
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags?.map(tag => (
                        <TagPill key={tag.tagId} tag={tag} variant="display" />
                    ))}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-end gap-2 text-xs font-medium text-gray-400">
                    <div className="flex flex-col gap-1 items-end">
                        <span className="text-gray-500">
                            Author: <span className="text-gray-700 font-semibold">{question.authorUsername}</span>
                        </span>
                        <span className="text-gray-500">
                            Modified at: <span className="text-gray-700 font-semibold">{question.updatedAt}</span>
                        </span>
                    </div>
                    <div
                        className="w-8 h-8 bg-black text-white font-medium text-lg rounded-full
                            flex justify-center items-center cursor-pointer shadow select-none
                            hover:ring-2 hover:ring-brand-300 transition-all"
                        onClick={() => navigate(`/profile/${question.authorUsername}`)}
                    >
                        {question.authorUsername?.[0]?.toUpperCase() || "?"}
                    </div>
                </div>

                {/* Comments toggle & list */}
                <CommentsList
                    postId={question.id || question.postId}
                    postType="ERROR_REPORT"
                    comments={question.comments}
                    hasMoreComments={question.hasMoreComments}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                    onUpdateComment={onUpdateComment}
                    isLoggedIn={isLoggedIn && !isAdmin}
                    commentLoader={commentLoader}
                />
            </div>
            <div className="absolute -top-3 -right-3 z-10">
                <ActionMenu
                    isLoggedIn={isLoggedIn && !isAdmin}
                    operable={question.operable && !isAdmin && question.status !== "CLOSED" && question.postStatus !== "CLOSED"}
                    canReport={!(question.operable && !isAdmin)}
                    onEdit={() => handleEdit()}
                    onDelete={() => handleDelete()}
                />
            </div>
        </div>
    )
}

export default QuestionCard
