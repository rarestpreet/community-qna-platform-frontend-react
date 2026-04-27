import { useState } from "react"
import apiCall from "../../services/apiCall"

function AnswerModal({ initialBody = "", onClose, operation, postId }) {
    const [body, setBody] = useState(initialBody)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!body.trim())
            return

        console.log(operation === "PUT");

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
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Share your knowledge..."
                        rows={6}
                        className="input-field resize-none"
                    />
                    <button type="submit" className="btn-primary w-full">
                        {loading ? "Loading" : operation === "PUT" ? "Save changes" : "Submit Answer"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AnswerModal;