import { useLocation, useNavigate, Link } from "react-router-dom"
import { useUserContext } from "../context/userContext"
import { FaUser, FaShieldAlt, FaHeartbeat, FaHistory, FaChartBar, FaSignOutAlt, FaArrowRight, FaUserEdit, FaCheckCircle, FaKey } from "react-icons/fa"
import apiCall from "../services/apiCall"

function SideNavBar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { loading, userProfile, setUserProfile, setLoading } = useUserContext()

    const isAdmin = userProfile?.roles === "ADMIN" || false
    const isOperable = userProfile?.username &&
        (
            location.pathname.includes(userProfile?.username) ||
            location.pathname === "/profile/edit" ||
            location.pathname === "/profile/verify-email" ||
            location.pathname === "/profile/reset-password"
        )

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
        navItems.push({ path: `/profile/${userProfile?.username}/edit`, label: "Edit Profile", icon: FaUserEdit })
        if (!userProfile?.accountVerified) {
            navItems.push({ path: `/profile/${userProfile?.username}/verify-email`, label: "Verify Email", icon: FaCheckCircle })
        }
        navItems.push({ path: `/profile/${userProfile?.username}/reset-password`, label: "Reset Password", icon: FaKey })
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
        <aside className="h-full w-64 shrink-0 flex flex-col bg-surface-container-lowest border-r border-outline-variant/20 text-sm font-medium">

            {/* ── User header ── */}
            <div className="p-5 pb-4">
                {userProfile?.username ?
                    (<div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-lg shadow-sm shrink-0">
                            {userProfile?.username?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-on-surface truncate">
                                {userProfile?.username || "User"}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                                {isAdmin ? "Admin Console" : "User Console"}
                            </span>
                        </div>
                    </div>
                    ) :
                    (
                        <Link
                            to="/register"
                            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-4 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer"
                        >
                            <span>Sign Up</span>
                            <FaArrowRight className="text-xs" />
                        </Link>
                    )}
            </div>

            <div className="mx-5 border-t border-outline-variant/20" />

            {/* ── Primary navigation ── */}
            {userProfile?.username && (
                <nav className="flex flex-col gap-1 p-4 grow">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-3 mb-1">
                        Navigation
                    </p>
                    {navItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                replace
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.97]
                                ${location.pathname === item.path
                                        ? "bg-primary-container text-on-primary-container font-semibold shadow-sm"
                                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
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
                        className="flex items-center gap-3 px-3 py-2.5 mt-auto rounded-xl text-error hover:bg-error/10 transition-all duration-150 active:scale-[0.97] cursor-pointer w-full text-left font-medium"
                    >
                        <FaSignOutAlt className="text-base" />
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