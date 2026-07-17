import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaRegClock, FaRegBookmark } from "react-icons/fa"
import Badge from "./Badge"

/**
 * FeedPost — post card in the home feed matching the new design.
 * Props:
 *   - post: FeedErrorReportResponseDTO { 
 *    navigationId,
 *    authorUsername,
 *    title,
 *    description,
 *    score,
 *    updatedAt,
 *    status,
 *    tags[],
 *    viewCount
 *    }
 */
function FeedPost({ post }) {
    const navigate = useNavigate()
    const { navigationId, authorUsername, title, description, score, viewCount, updatedAt, status, tags } = post

    // Simple time ago formatter
    const getTimeAgo = (dateStr) => {
        if (!dateStr) return "Some time ago"
        // dateStr is dd-MM-yyyy. We might not have exact time. 
        // For simplicity just show the date.
        return dateStr
    }

    return (
        <article
            onClick={() => navigate(`/question/${navigationId}`)}
            className="group bg-surface-container-low hover:bg-surface-container border border-surface-container rounded-xl p-5 shadow-sm transition-all hover:shadow-md cursor-pointer"
        >
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant mb-4">
                <div className="flex items-center gap-3">
                    <Badge status={status} />
                    <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                        <FaRegClock className="text-xs" />
                        {getTimeAgo(updatedAt)}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-on-surface-variant">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-on-surface">{score || 0}</span>
                        <span className="text-[10px] uppercase">Score</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-on-surface">{viewCount || 0}</span>
                        <span className="text-[10px] uppercase">Views</span>
                    </div>
                </div>
            </div>

            <h3 className="font-headline-sm text-[20px] font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                {title}
            </h3>

            {description && (
                <p className="text-on-surface-variant text-body-sm line-clamp-3 mb-4">
                    {description}
                </p>
            )}

            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex justify-center items-center font-bold text-[10px] bg-primary text-white">
                        {authorUsername ? authorUsername.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="text-xs font-medium text-on-surface">{authorUsername || 'Unknown'}</span>

                    {tags && tags.length > 0 && (
                        <div className="flex gap-2 ml-4 flex-wrap">
                            {tags.slice(0, 3).map(tag => (
                                <span key={tag.tagId} className="px-2 py-1 rounded bg-surface text-on-surface-variant text-[10px] font-label-md font-semibold tracking-wide uppercase">
                                    {tag.name}
                                </span>
                            ))}
                            {tags.length > 3 && (
                                <span className="px-2 py-1 rounded bg-surface text-on-surface-variant text-[10px] font-label-md font-semibold">
                                    +{tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <button
                    className="text-outline-variant hover:text-primary transition-colors p-1"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent navigation
                        // handle bookmark if backend supported it
                    }}
                >
                    <FaRegBookmark />
                </button>
            </div>
        </article>
    )
}

export default FeedPost