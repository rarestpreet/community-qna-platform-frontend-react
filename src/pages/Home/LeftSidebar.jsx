import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../context/userContext"
import { FaHome, FaRss, FaBookmark, FaMedal, FaCog, FaPlusCircle, FaQuestionCircle, FaShieldAlt } from "react-icons/fa"
import { FaTerminal } from "react-icons/fa"

export default function LeftSidebar() {
    const navigate = useNavigate()
    const { userProfile } = useUserContext()

    return (
        <aside className="fixed left-0 top-[72px] bottom-0 w-64 hidden lg:flex flex-col gap-4 py-8 px-4 border-r border-surface-container bg-surface-container-low overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container">
                    <FaTerminal className="text-xl" />
                </div>
                <div>
                    <p className="font-label-md text-label-md font-bold text-on-surface">
                        {userProfile?.username ? `Welcome back` : `Welcome to`}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                        {userProfile?.username ? userProfile.username : `DevSolve`}
                    </p>
                </div>
            </div>

            <nav className="flex flex-col gap-1">
                <button onClick={() => navigate("/")} className="w-full text-left bg-primary-container/20 text-primary font-bold rounded-xl px-4 py-3 flex items-center gap-3 group transition-all active:scale-[0.97]">
                    <FaHome className="text-lg group-hover:scale-110 transition-transform" />
                    <span className="font-label-md text-label-md">Home</span>
                </button>
                {/* 
                <button className="w-full text-left text-on-surface-variant hover:bg-surface-container rounded-xl px-4 py-3 flex items-center gap-3 group transition-all cursor-not-allowed opacity-60">
                    <FaRss className="text-lg" />
                    <span className="font-label-md text-label-md">My Feed</span>
                </button>
                <button className="w-full text-left text-on-surface-variant hover:bg-surface-container rounded-xl px-4 py-3 flex items-center gap-3 group transition-all cursor-not-allowed opacity-60">
                    <FaBookmark className="text-lg" />
                    <span className="font-label-md text-label-md">Saved</span>
                </button>
                <button className="w-full text-left text-on-surface-variant hover:bg-surface-container rounded-xl px-4 py-3 flex items-center gap-3 group transition-all cursor-not-allowed opacity-60">
                    <FaMedal className="text-lg" />
                    <span className="font-label-md text-label-md">Leaderboard</span>
                </button>
                */}
                <button className={`w-full text-left text-on-surface-variant hover:bg-surface-container rounded-xl px-4 py-3 flex items-center gap-3 group transition-all cursor-not-allowed opacity-60`}>
                    <FaCog className="text-lg" />
                    <span className="font-label-md text-label-md">Settings</span>
                </button>
            </nav>

            <button
                onClick={() => userProfile?.username ? navigate("/ask") : navigate("/register")}
                className="mt-6 w-full py-3 px-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-colors active:scale-95 shadow-sm"
            >
                <FaPlusCircle className="text-sm" />
                {userProfile?.username ? "Post a Question" : "Sign Up"}
            </button>

            <div className="mt-auto pt-6 flex flex-col gap-1 border-t border-surface-container">
                <button className="w-full text-left text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-xl flex items-center gap-3 transition-colors cursor-not-allowed opacity-60">
                    <FaQuestionCircle />
                    <span className="text-xs">Support</span>
                </button>
                <button className="w-full text-left text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-xl flex items-center gap-3 transition-colors cursor-not-allowed opacity-60">
                    <FaShieldAlt />
                    <span className="text-xs">Privacy</span>
                </button>
            </div>
        </aside>
    )
}
