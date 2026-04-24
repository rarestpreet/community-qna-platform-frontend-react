import { Link, useNavigate, useLocation } from "react-router-dom"
import BrandContainer from "./ui/BrandContainer"
import { FaArrowRight, FaUser, FaTag, FaHeartbeat, FaArrowLeft } from "react-icons/fa"
import { IoMdLogOut } from "react-icons/io"
import { useUserContext } from "../context/userContext"
import { useEffect, useRef, useState } from "react"
import apiCall from "../services/apiCall"

function NavBar() {
    const { userProfile, setUserProfile, setLoading } = useUserContext()
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
        <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100 shadow-sm">
            <BrandContainer />

            {userProfile?.username ? (
                <div className="relative" ref={dropDownRef}>
                    <div
                        className={`w-10 h-10 bg-black text-white font-medium text-xl rounded-full
                            flex justify-center items-center  shadow select-none
                            hover:ring-2  transition-all
                            ${isInProfileLayout ? "cursor-not-allowed" : "hover:ring-brand-300 cursor-pointer"}`}
                        onClick={() => setIsDropDownOpen(state => !state)}
                    >
                        {userProfile.username[0].toUpperCase()}
                    </div>

                    {!isInProfileLayout && isDropDownOpen && (
                        <div className="absolute shadow-xl bg-white rounded-xl border border-gray-100 p-1 top-14 right-0 z-50 min-w-48 flex flex-col gap-0.5
                            animate-[fadeIn_150ms_ease-out]">

                            {/* Profile — disabled in ProfileLayout */}
                            <div
                                className="flex items-center gap-2 py-2 px-3 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setIsDropDownOpen(false)
                                    navigate(`/profile/${userProfile.username}`)
                                }}
                            >
                                <FaUser className="text-sm" />
                                Profile
                            </div>

                            {/* Admin Dashboard (admin only) */}
                            {userProfile.roles.includes("ADMIN") && (
                                <div
                                    className="flex items-center gap-2 cursor-pointer py-2 px-3 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
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
                            {userProfile.roles.includes("ADMIN") && (
                                <div
                                    className="flex items-center gap-2 cursor-pointer py-2 px-3 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
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
                            <div className="my-1 border-t border-gray-100" />

                            {/* Logout */}
                            <div
                                className="flex items-center gap-2 cursor-pointer py-2 px-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer"
                >
                    <span>Sign Up</span>
                    <FaArrowRight className="text-xs" />
                </Link>
            )}
        </div>
    )
}

export default NavBar