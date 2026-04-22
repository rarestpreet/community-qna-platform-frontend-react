import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaPlus, FaTags, FaChartBar } from "react-icons/fa"
import { useUserContext } from "../../context/userContext"
import apiCall from "../../services/apiCall"
import PageLoader from "../../components/ui/PageLoader"

function HomeSidebar() {
    const navigate = useNavigate()
    const { userProfile } = useUserContext()
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTags = async () => {
            const data = await apiCall.getAllTags(setLoading, setTags)
        }
        fetchTags()
    }, [])

    return (
        <div className="flex flex-col gap-6 sticky top-20">
            {/* Ask a Question CTA */}
            <div className="bg-brand-500 rounded-2xl p-6 text-white shadow-md">
                <h3 className="font-bold text-lg mb-2">Got a Question?</h3>
                <p className="text-sm text-white/80 mb-4 leading-relaxed">
                    Share your question with the community and get expert answers.
                </p>
                <button
                    onClick={() => userProfile?.username
                        ? navigate("/ask")
                        : navigate("/register")
                    }
                    className="w-full bg-white text-brand-600 font-bold text-sm py-2.5 rounded-xl
                        hover:bg-gray-50 transition-colors flex items-center justify-center gap-2
                        shadow-sm active:scale-[0.97] cursor-pointer"
                >
                    <FaPlus className="text-xs" />
                    {userProfile?.username ? "Ask a Question" : "Sign Up to Ask"}
                </button>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <FaTags className="text-brand-500" />
                    Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {
                        loading ? (
                            <PageLoader text="Loading popular tags..." />
                        ) : (
                            tags.length > 0 ? (
                                tags.map(tag => (
                                    <span
                                        key={tag.tagId}
                                        className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5
                                    rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors cursor-default"
                                        title={tag.description}
                                    >
                                        {tag.name}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">No tags yet.</p>
                            )
                        )
                    }
                </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <FaChartBar className="text-brand-500" />
                    Community
                </h3>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span>Tags</span>
                        <span className="font-bold text-gray-900">{tags.length}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeSidebar
