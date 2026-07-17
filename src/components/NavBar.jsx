import { Link, useNavigate, useLocation } from "react-router-dom"
import BrandContainer from "./ui/BrandContainer"
import { FaArrowRight, FaUser, FaTag, FaHeartbeat, FaArrowLeft, FaSearch, FaBell, FaSun, FaMoon } from "react-icons/fa"
import { IoMdLogOut } from "react-icons/io"
import { useUserContext } from "../context/userContext"
import { useTheme } from "../context/ThemeContext"
import { useEffect, useRef, useState } from "react"
import apiCall from "../services/apiCall"

function NavBar() {
    const { userProfile, setUserProfile, setLoading } = useUserContext()
    const { theme, toggleTheme } = useTheme()
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const dropDownRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    // Routes that have the SideNavBar (ProfileLayout) — Profile link should be disabled here
    const isInProfileLayout =
        location.pathname.startsWith("/profile/") ||
        location.pathname === "/health" ||
        location.pathname === "/tag"

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current &&
                !dropDownRef.current.contains(event.target)
            ) {
                setIsDropDownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleLogout = async () => {
        await apiCall.terminateSession(setLoading, setUserProfile)
        navigate("/")
    }

    return (
        <div className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 py-3 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm gap-4">
            <div className="flex-shrink-0 lg:w-1/4 flex items-center">
                <BrandContainer />
            </div>

            {/* Search Area - temporarily hidden
            <div className="flex-1 max-w-2xl hidden md:flex items-center gap-2">
                <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100 transition-all shadow-inner">
                    <FaSearch className="text-gray-400 mr-3 text-sm" />
                    <input 
                        type="text" 
                        placeholder="Search error reports, tags, or users..." 
                        className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                    />
                </div>
                <button className="flex-shrink-0 bg-primary hover:bg-brand-700 text-on-primary px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
                    Advanced Search
                </button>
            </div>
            */}

            <div className="flex-shrink-0 lg:w-1/4 flex items-center justify-end gap-3 sm:gap-4">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors focus:outline-none"
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
                </button>

                {/* Notification Button - temporarily hidden
                {userProfile?.username && (
                    <button className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded-xl transition-colors">
                        <FaBell className="text-xl" />
                        <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
                    </button>
                )}
                */}

                {userProfile?.username ? (
                    <div className="relative" ref={dropDownRef}>
                        <div
                            className={`w-10 h-10 bg-inverse-surface text-inverse-on-surface font-bold text-lg rounded-xl
                            flex justify-center items-center shadow select-none
                            hover:ring-2 hover:ring-offset-2 transition-all
                            ${isInProfileLayout ? "cursor-not-allowed opacity-80" : "hover:ring-primary cursor-pointer"}`}
                            onClick={() => setIsDropDownOpen(state => !state)}
                        >
                            {userProfile.username[0].toUpperCase()}
                        </div>

                        {!isInProfileLayout && isDropDownOpen && (
                            <div className="absolute shadow-xl bg-surface-container-low rounded-xl border border-outline-variant p-2 top-14 right-0 z-50 min-w-56 flex flex-col gap-1
                            animate-[fadeIn_150ms_ease-out] transform origin-top-right">

                                {/* Profile — disabled in ProfileLayout */}
                                <div
                                    className="flex items-center gap-2 py-2 px-3 text-sm font-medium rounded-lg transition-colors text-on-surface hover:bg-surface-container cursor-pointer"
                                    onClick={() => {
                                        setIsDropDownOpen(false)
                                        navigate(`/profile/${userProfile.username}`)
                                    }}
                                >
                                    <FaUser className="text-sm" />
                                    Profile
                                </div>

                                {/* Admin Dashboard (admin only) */}
                                {userProfile.roles === "ADMIN" && (
                                    <div
                                        className="flex items-center gap-2 cursor-pointer py-2 px-3 text-sm font-medium text-primary hover:bg-primary-container/20 rounded-lg transition-colors"
                                        onClick={() => {
                                            setIsDropDownOpen(false)
                                            navigate("/tag")
                                        }}
                                    >
                                        <FaTag className="text-sm" />
                                        Admin Dashboard
                                    </div>
                                )}

                                {/* Health Check (admin only) */}
                                {userProfile.roles === "ADMIN" && (
                                    <div
                                        className="flex items-center gap-2 cursor-pointer py-2 px-3 text-sm font-medium text-primary hover:bg-primary-container/20 rounded-lg transition-colors"
                                        onClick={() => {
                                            setIsDropDownOpen(false)
                                            navigate("/health")
                                        }}
                                    >
                                        <FaHeartbeat className="text-sm" />
                                        Health Check
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="my-1 border-t border-outline-variant" />

                                {/* Logout */}
                                <div
                                    className="flex items-center gap-2 cursor-pointer py-2 px-3 text-sm font-medium text-error hover:bg-error-container/20 rounded-lg transition-colors"
                                    onClick={handleLogout}
                                >
                                    <IoMdLogOut className="text-lg" />
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/register"
                        className="flex items-center gap-2 bg-primary hover:brightness-110 text-on-primary px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer"
                    >
                        <span>Sign Up</span>
                        <FaArrowRight className="text-xs" />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default NavBar