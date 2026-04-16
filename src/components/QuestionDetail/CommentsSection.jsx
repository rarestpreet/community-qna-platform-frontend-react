import { useState } from "react";
import { FaUserCircle, FaRegClock, FaPen, FaComment, FaChevronDown, FaChevronUp } from "react-icons/fa";

function formatDate(isoString) {
    return new Date(isoString).toLocaleString(undefined, {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function CommentItem({ comment }) {
    return (
        <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
            <FaUserCircle className="text-gray-300 text-2xl shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-relaxed">{comment.body}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="font-medium text-gray-500">Author #{comment.authorId}</span>
                    <span className="flex items-center gap-1"><FaRegClock />{formatDate(comment.updatedAt)}</span>
                    {comment.isEditable && (
                        <button className="flex items-center gap-1 text-green-500 hover:text-green-700 font-semibold transition-colors">
                            <FaPen className="text-[10px]" /> Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CommentsSection({ postId, comments, userProfile }) {
    const [open, setOpen] = useState(false);
    const [commentBody, setCommentBody] = useState("");

    const MIN = 10;
    const MAX = 100;
    const trimmed = commentBody.trim();
    const tooShort = trimmed.length > 0 && trimmed.length < MIN;
    const tooLong = commentBody.length > MAX;
    const canPost = trimmed.length >= MIN && !tooLong;

    const handlePost = (e) => {
        e.preventDefault();
        if (!canPost) return;
        // TODO: wire up API — payload: { body: commentBody, postId }
        setCommentBody("");
    };

    const hasComments = comments && comments.length > 0;

    return (
        <div className="mt-4 flex flex-col gap-2">

            {/* ── Add-comment row */}
            {userProfile?.username && (
                <>
                    <form onSubmit={handlePost} className="flex items-center gap-3">
                        <div className="shrink-0">
                            <FaUserCircle className="text-gray-300 text-3xl" />
                        </div>

                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={commentBody}
                                onChange={e => setCommentBody(e.target.value)}
                                placeholder="Add a comment…"
                                maxLength={MAX}
                                className={`w-full text-sm px-4 py-2 rounded-xl border transition focus:outline-none focus:ring-2
                                    ${tooLong
                                        ? "border-red-400 bg-red-50 focus:ring-red-300"
                                        : tooShort
                                            ? "border-amber-300 focus:ring-amber-300"
                                            : "border-gray-200 bg-gray-50 focus:bg-white focus:ring-green-400"
                                    }`}
                            />
                            {commentBody.length > 0 && (
                                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium tabular-nums pointer-events-none
                                    ${tooLong ? "text-red-400" : tooShort ? "text-amber-400" : "text-gray-400"}`}>
                                    {commentBody.length}/{MAX}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!canPost}
                            className="shrink-0 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold
                                disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shadow-sm"
                        >
                            Post
                        </button>
                    </form>

                    {/* validation hint */}
                    {tooShort && (
                        <p className="text-amber-500 text-[11px] font-medium pl-10">
                            Comment must be at least {MIN} characters.
                        </p>
                    )}
                </>
            )}

            {/* ── Toggle + list */}
            {hasComments && (
                <>
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-green-600 transition-colors self-start"
                    >
                        <FaComment className="text-green-400" />
                        {open ? "Hide" : "Show"} {comments.length} comment{comments.length !== 1 ? "s" : ""}
                        {open ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                    </button>
                    {open && (
                        <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-1">
                            {comments.map(c => <CommentItem key={c.commentId} comment={c} />)}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
