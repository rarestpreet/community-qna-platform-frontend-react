import { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function VoteBox({ score, voted, userProfile }) {
    const [localScore, setLocalScore] = useState(score);
    const [localVoted, setLocalVoted] = useState(voted);

    const handleUp = () => {
        if (!userProfile?.username) return;
        setLocalScore(prev => localVoted ? prev - 1 : prev + 1);
        setLocalVoted(prev => !prev);
    };
    const handleDown = () => {
        if (!userProfile?.username) return;
        setLocalScore(prev => localVoted ? prev - 1 : prev - 1);
    };

    return (
        <div className="flex flex-col items-center gap-1 pt-1">
            <button
                onClick={handleUp}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${localVoted ? "bg-green-500 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-600"}`}
                title="Upvote"
            >
                <FaArrowUp className="text-sm" />
            </button>
            <span className={`font-bold text-lg tabular-nums leading-none ${localVoted ? "text-green-600" : "text-gray-700"}`}>
                {localScore}
            </span>
            <button
                onClick={handleDown}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-all"
                title="Downvote"
            >
                <FaArrowDown className="text-sm" />
            </button>
        </div>
    );
}
