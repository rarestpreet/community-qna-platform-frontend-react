import { useState } from "react"
import apiCall from "../../services/apiCall"

function CharCounter({ current, min, max }) {
    const isOver = current > max
    const isUnder = current < min
    const color = isOver
        ? "text-red-500"
        : isUnder && current > 0
            ? "text-amber-500"
            : "text-gray-400"

    return (
        <span className={`text-xs font-medium tabular-nums ${color}`}>
            {current} / {max}
        </span>
    )
}

function AnswerModal({ initialBody = "", onClose, operation, postId }) {
    const [body, setBody] = useState(initialBody)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!body.trim()) {
            setError("Answer is required.")
            return
        }
        
        if (body.length < 150 || body.length > 1500) {
            setError("Answer must be between 150 and 1500 characters.")
            return
        }

        setError("")

        if (operation === "POST")
            await apiCall.postAnswer(postId, body, setLoading)
        else
            await apiCall.updateAnswer(postId, body, setLoading)

        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative
                        animate-[fadeIn_150ms_ease-out]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold text-xl cursor-pointer"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {operation === "PUT" ? "Update your answer" : "Write your answer"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-gray-700">
                                Answer <span className="text-red-500">*</span>
                            </label>
                            <CharCounter current={body.length} min={150} max={1500} />
                        </div>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Share your knowledge..."
                            rows={6}
                            maxLength={1500}
                            className={`input-field resize-none ${error ? "input-error" : ""}`}
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>
                        )}
                    </div>
                    <button type="submit" className="btn-primary w-full">
                        {loading ? "Loading" : operation === "PUT" ? "Save changes" : "Submit Answer"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AnswerModal;