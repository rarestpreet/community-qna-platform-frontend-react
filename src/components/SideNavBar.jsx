import { useLocation, useNavigate, Link } from "react-router-dom"
import { useUserContext } from "../context/userContext"
import { FaUser, FaShieldAlt, FaHeartbeat, FaHistory, FaChartBar, FaSignOutAlt, FaArrowRight, FaUserEdit, FaCheckCircle, FaKey } from "react-icons/fa"
import apiCall from "../services/apiCall"

function SideNavBar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { loading, userProfile, setUserProfile, setLoading } = useUserContext()

    const isAdmin = userProfile?.roles?.includes("ADMIN") || false
    const searchParams = new URLSearchParams(location.search)
    const currentTab = searchParams.get("tab")

    const isOperable = userProfile?.username && location.pathname.includes(userProfile?.username)

    // ── Navigation items (role-based) ──
    let navItems = [
        { path: `/profile/${userProfile?.username}`, label: "My Profile", icon: FaUser },
    ]

    // Admins always see these
    if (isAdmin) {
        navItems.push({ path: "/tag", label: "Admin Dashboard", icon: FaShieldAlt })
        navItems.push({ path: "/health", label: "Health Check", icon: FaHeartbeat })
    }

    // Operable links (Profile tools) - only shown when on own profile page
    if (!isAdmin && isOperable) {
        navItems.push({ path: `/profile/${userProfile?.username}?tab=edit`, label: "Edit Profile", icon: FaUserEdit })
        if (!userProfile?.accountVerified) {
            navItems.push({ path: `/profile/${userProfile?.username}?tab=verify-email`, label: "Verify Email", icon: FaCheckCircle })
        }
        navItems.push({ path: `/profile/${userProfile?.username}?tab=reset-password`, label: "Reset Password", icon: FaKey })
    }

    // ── Bottom utility links (only for admin) ──
    const bottomItems = [
        { path: "#", label: "Logs", icon: FaHistory },
        { path: "#", label: "Reports", icon: FaChartBar },
    ]

    const handleLogout = async () => {
        await apiCall.terminateSession(setLoading, setUserProfile)
        navigate("/")
    }

    return (
        <aside className="h-full w-64 shrink-0 flex flex-col bg-surface-container-low border-r border-outline-variant/30 text-sm font-medium">

            {/* ── User header ── */}
            <div className="p-6 pb-4">
                {userProfile?.username ?
                    (<div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary font-black text-xl shadow-sm shrink-0">
                            {userProfile?.username?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-on-surface truncate">
                                {userProfile?.username || "User"}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
                                {isAdmin ? "Admin Console" : "User Console"}
                            </span>
                        </div>
                    </div>
                    ) :
                    (
                        <Link
                            to="/register"
                            className="flex items-center gap-2 bg-primary hover:brightness-110 text-on-primary px-4 py-4 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer"
                        >
                            <span>Sign Up</span>
                            <FaArrowRight className="text-xs" />
                        </Link>
                    )}
            </div>

            <div className="mx-6 border-t border-outline-variant/30" />

            {/* ── Primary navigation ── */}
            {userProfile?.username && (
                <nav className="flex flex-col gap-1.5 p-4 grow">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-4 mb-2 mt-2">
                        Navigation
                    </p>
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const itemTab = new URLSearchParams(item.path.split('?')[1] || "").get("tab")
                        const isActive = (itemTab && currentTab === itemTab) || (!itemTab && !currentTab && location.pathname === item.path)

                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                replace
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 active:scale-[0.98]
                                ${isActive
                                        ? "bg-primary-container/20 text-primary font-bold shadow-sm"
                                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50 font-medium"
                                    }
                                    ${item.path === "#" ? "cursor-not-allowed" : ""}
                                `}

                            >
                                <Icon className="text-base" />
                                {item.label}
                            </Link>
                        )
                    })}

                    {/* Logout — inside Navigation section, at the bottom */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 mt-auto rounded-xl text-error hover:bg-error-container/20 transition-all duration-150 active:scale-[0.98] cursor-pointer w-full text-left font-bold"
                    >
                        <FaSignOutAlt className="text-lg" />
                        Logout
                    </button>
                </nav>
            )}

            {/* ── Bottom section — Workspace ── */}
            {userProfile?.username && isAdmin && (
                <div className="flex flex-col gap-1 border-t border-outline-variant/20 px-4 pt-4 pb-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-3 mb-1">
                        Workspace
                    </p>
                    {bottomItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all duration-150"
                            >
                                <Icon className="text-base" />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>
            )}
        </aside>
    )
}

export default SideNavBar