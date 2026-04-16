import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FeedPost({ post, index }) {
    const navigate = useNavigate();
    const {
        authorId,
        createdAt,
        postId,
        score,
        status,
        tags,
        title } = post

    const [hoverIndex, setHoverIndex] = useState(null)

    return (
        <div key={index} 
        onClick={() => navigate(`/question/${postId}`)}
        className="group bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-md
        flex gap-6 items-center w-full
        hover:shadow-xl hover:border-green-500 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">

            {/* Score Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-xl min-w-[70px] min-h-[70px] px-3 py-2 shrink-0 group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                <span className="text-black group-hover:text-green-600 font-bold text-2xl leading-none mb-1 transition-colors">{score}</span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Score</span>
            </div>

            {/* Main Content Section */}
            <div className="flex flex-col grow gap-2 items-start text-left">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{title}</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                    {
                        tags?.map((currTag, index) => {
                            return (
                                <div key={index}
                                    className="relative flex items-center justify-center"
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onMouseLeave={() => setHoverIndex(null)}>
                                    <span
                                        className="rounded-md px-2.5 py-1 bg-black text-white text-xs font-bold 
                                        uppercase tracking-wider shadow-sm cursor-help">
                                        {currTag.name}
                                    </span>
                                    {hoverIndex === index && (
                                        <div className="absolute top-full mt-2.5 px-3 py-1.5 bg-gray-800 text-white text-xs text-center leading-relaxed rounded shadow-lg z-20 pointer-events-none w-max max-w-[200px] sm:max-w-xs after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-gray-800">
                                            {currTag.description}
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {/* Meta Section */}
            <div className="flex flex-col items-end gap-3 shrink-0">
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {status}
                </span>
                <div className="flex flex-col items-end gap-0.5 text-xs font-medium text-gray-400">
                    <span className="text-gray-500">Author ID: <span className="text-gray-700 font-semibold">{authorId}</span></span>
                    <span>{new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
            </div>

        </div>
    );
}

export default FeedPost;
