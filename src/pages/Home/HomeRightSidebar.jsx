import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaHashtag, FaChartLine, FaTag, FaTrophy, FaChevronRight, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa"
import { MdVerified } from "react-icons/md"
import { useUserContext } from "../../context/userContext"
import apiCall from "../../services/apiCall"
import PageLoader from "../../components/ui/PageLoader"

export default function HomeRightSidebar() {
    const navigate = useNavigate()
    const { userProfile } = useUserContext()
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTags = async () => {
            await apiCall.getAllTags(8, 0, setLoading, setTags)
        }
        fetchTags()
    }, [])

    return (
        <aside className="flex-1 lg:max-w-[30%] flex flex-col gap-6 sticky top-20">
            {/* Profile Summary Widget */}
            {userProfile?.username && (
                <section className="bg-surface border border-surface-container rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 rounded-full border-4 border-primary-container bg-primary-container/20 text-primary overflow-hidden mb-4 flex items-center justify-center text-2xl font-bold">
                            {userProfile.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-headline-sm text-headline-sm">{userProfile.username}</h4>
                            {userProfile.accountVerified || userProfile.isAccountVerified ? (
                                <FaCheckCircle className="text-primary text-[16px]" title="Verified User" />
                            ) : (
                                <FaExclamationTriangle className="text-tertiary text-[16px]" title="Unverified User" />
                            )}
                        </div>
                        <p className="text-on-surface-variant text-body-sm font-medium">{userProfile.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                            <span className="font-bold text-primary">0</span>
                            <span className="text-[10px] text-on-surface-variant font-bold uppercase">My Reports</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                            <span className="font-bold text-primary">0</span>
                            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Saved</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/profile/${userProfile.username}/edit`)}
                        className="w-full py-2 border border-surface-container rounded-xl text-body-sm font-bold hover:bg-surface-container transition-colors"
                    >
                        Edit Profile
                    </button>
                </section>
            )}

            {/* Popular Tags Widget */}
            <section className="bg-surface border border-surface-container rounded-xl p-6 shadow-sm">
                <h4 className="font-bold mb-4 flex justify-between items-center">
                    Popular Tags
                    <FaChartLine className="text-outline-variant text-sm" />
                </h4>
                <div className="flex flex-wrap gap-2">
                    {loading ? (
                        <div className="w-full flex justify-center"><PageLoader text="" /></div>
                    ) : tags.length > 0 ? (
                        tags.slice(0, 8).map(tag => (
                            <div key={tag.tagId} className="px-3 py-1.5 bg-surface-container-low hover:bg-primary-container/20 hover:text-primary text-on-surface text-xs rounded-full transition-all flex items-center gap-2 cursor-pointer" title={tag.description}>
                                <span>#{tag.name}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-outline-variant">No tags yet.</p>
                    )}
                </div>
            </section>

            {/* Platform Stats Widget - temporarily hidden
            <section className="bg-primary text-on-primary rounded-xl p-6 shadow-md relative overflow-hidden group">
                <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <FaChartLine className="text-9xl" />
                </div>
                <h4 className="font-bold mb-6 relative z-10">Platform Activity</h4>
                <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                        <span className="text-on-primary/70 text-body-sm">Tags</span>
                        <span className="font-bold text-headline-sm">{tags.length}</span>
                    </div>
                    <div className="w-full bg-on-primary/20 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary-fixed h-full w-[85%]"></div>
                    </div>
                </div>
            </section>
            */}

            {/* Quick Actions Widget */}
            <section className="bg-surface border border-surface-container rounded-xl p-4 shadow-sm">
                <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors group cursor-not-allowed opacity-60">
                        <div className="flex items-center gap-3">
                            <FaTag className="text-primary" />
                            <span className="font-bold text-body-sm">Browse Tags</span>
                        </div>
                        <FaChevronRight className="text-outline-variant group-hover:translate-x-1 transition-transform" />
                    </button>
                    {/* Global Leaderboard - temporarily hidden
                    <button className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors group cursor-not-allowed opacity-60">
                        <div className="flex items-center gap-3">
                            <FaTrophy className="text-primary" />
                            <span className="font-bold text-body-sm">Global Leaderboard</span>
                        </div>
                        <FaChevronRight className="text-outline-variant group-hover:translate-x-1 transition-transform" />
                    </button>
                    */}
                </div>
            </section>
        </aside>
    )
}
