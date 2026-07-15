import { FaEllipsisV } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import ActionMenu from "./ActionMenu"

/**
 * CommentItem — single comment row.
 * Props:
 *   - comment: {
 *  commentId,
 *  body,
 *  authorUsername,
 *  navgationPostId,
 *  updatedAt,
 *  operable
 *  }
 *   - onDelete: (commentId) => void
 */
function CommentItem({ key, comment, onDelete, onEdit, isLoggedIn }) {
    const navigate = useNavigate()

    return (
        <div className="px-2 rounded-xl flex items-center gap-2 py-2 group hover:bg-surface-container-lowest">
            <div
                className="w-6 h-6 bg-black text-white font-medium text-xs rounded-full
                            flex justify-center items-center cursor-pointer shadow select-none
                            hover:ring-2 hover:ring-brand-300 transition-all"
                onClick={() => navigate(`/profile/${comment.authorUsername}`)}
            >
                {comment.authorUsername[0].toUpperCase()}
            </div>
            <p className="text-sm text-gray-700 border-l-2 border-gray-200 pl-2 flex-1 leading-relaxed">
                {comment.type && (
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mr-2 bg-gray-200 text-gray-600">
                        {comment.type}
                    </span>
                )}
                {comment.body}
            </p>

            <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-400 font-medium">
                    {comment.updatedAt}
                </span>
                <ActionMenu
                    isLoggedIn={isLoggedIn}
                    operable={comment.operable}
                    canReport={!comment.operable}
                    onDelete={() => onDelete(comment.commentId)}
                    onEdit={() => onEdit(comment)}
                />
            </div>
        </div>
    )
}

export default CommentItem
