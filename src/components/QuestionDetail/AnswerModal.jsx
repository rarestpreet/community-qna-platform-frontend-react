import { useState } from "react";
import { FaReply } from "react-icons/fa";
import apiCall from "../../services/apiCall";
import { useUserContext } from "../../context/userContext";

export default function AnswerModal({ parentPostId, onClose }) {
    const [body, setBody] = useState("");
    const { loading, setLoading } = useUserContext()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await apiCall.postAnswer(parentPostId, setLoading)
    };

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose()
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdrop}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaReply className="text-green-500" /> Post Your Answer
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 text-xl font-bold transition-colors leading-none"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-5">
                    <p className="text-sm text-gray-500">
                        Write a clear, detailed answer.
                    </p>
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor="answer-body" className="text-sm font-semibold text-gray-700">
                                Your Answer <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <textarea
                            id="answer-body"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            placeholder="Share your knowledge. Be specific and detailed!"
                            rows={8}
                            maxLength={MAX}
                            autoFocus
                            className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none
                                focus:outline-none focus:ring-2 transition`}
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm shadow-md
                                disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                        >
                            Submit Answer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
