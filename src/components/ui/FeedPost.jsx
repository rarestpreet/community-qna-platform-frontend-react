import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Badge from "./Badge"
import TagPill from "./TagPill"
import helperFunctions from "../../services/helperFunctions"

/**
 * FeedPost — post card in the home feed.
 * Props:
 *   - post: FeedPostResponseDTO { 
   postId,
   authorId,
   title,
   score,
   createdAt,
   status,
   tags[]
   }
 */
function FeedPost({ post }) {
    const navigate = useNavigate()
    const { navigationPostId, authorUsername, title, score, updatedAt, postStatus, tags } = post
    const [hoverIndex, setHoverIndex] = useState(null)
    const navigateTo = helperFunctions.encryptNavId(navigationPostId)

    return (
        <div
            key={navigationPostId}
            onClick={() => navigate(`/question/${navigateTo}`)}
            className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm
                flex gap-6 items-center w-full
                hover:shadow-lg hover:border-brand-300 hover:-translate-y-0.5
                transition-all duration-300 cursor-pointer"
        >
            {/* Score section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100
                rounded-xl min-w-[70px] min-h-[70px] px-3 py-2 shrink-0
                group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors"
            >
                <span className="text-black group-hover:text-brand-600 font-bold text-2xl leading-none mb-1 transition-colors">
                    {score}
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Score
                </span>
            </div>

            {/* Main content */}
            <div className="flex flex-col grow gap-2 items-start text-left min-w-0">
                <h2 className="text-lg font-bold text-gray-900 leading-tight w-full">
                    {title}
                </h2>
                <div className="flex flex-wrap gap-2 mt-1">
                    {tags?.map((currTag, index) => (
                        <div
                            key={currTag.tagId}
                            className="relative flex items-center justify-center"
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <TagPill tag={currTag} variant="display" />
                            {hoverIndex === index && currTag.description && (
                                <div className="absolute top-full mt-2.5 px-3 py-1.5 bg-gray-800 text-white text-xs text-center leading-relaxed rounded shadow-lg z-20 pointer-events-none w-max max-w-[200px] sm:max-w-xs
                                    after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-gray-800"
                                >
                                    {currTag.description}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Meta section */}
            <div className="flex flex-col items-end gap-3 shrink-0">
                <Badge status={postStatus} />
                <div className="flex flex-col items-end gap-0.5 text-xs font-medium text-gray-400">
                    <span className="text-gray-500">
                        Author: <span className="text-gray-700 font-semibold">{authorUsername}</span>
                    </span>
                    <span className="text-gray-500">
                        Modified at: <span className="text-gray-700 font-semibold">{updatedAt}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default FeedPost