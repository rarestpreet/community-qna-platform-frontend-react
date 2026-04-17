import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useUserContext } from "../../context/userContext";
import apiCall from "../../services/apiCall";
import { Link } from "react-router-dom";

export default function PageNavBar({ title }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { userProfile, setUserProfile, setLoading } = useUserContext();
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = async () => {
        await apiCall.terminateSession(setLoading, setUserProfile);
        navigate("/");
    };

    return (
        <div className="flex justify-between items-center p-4 bg-green-500 shadow-md">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-black px-3 py-2 rounded-xl font-bold transition-all shadow-sm cursor-pointer select-none"            >
                <FaArrowLeft /> Back
            </button>
            {userProfile?.username ?
                <div className="relative" >
                    <div
                        className={`w-10 h-10 bg-black text-white font-medium text-xl rounded-full flex justify-center items-center cursor-pointer shadow transition-colors select-none`}
                        onClick={() => setDropOpen(state => !state)}
                    >
                        {userProfile.username[0].toUpperCase()}
                    </div>
                    {dropOpen && (
                        <div
                            className="absolute shadow-lg bg-gray-50 rounded-md p-1 top-14 right-0 z-50 min-w-25 border border-gray-100 flex flex-col gap-1"
                            ref={dropRef}>
                            {title !== "User profile" &&
                                <div className="cursor-pointer py-1 px-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                    onClick={() => {
                                        setDropOpen(false);
                                        navigate(`/profile/${userProfile.username}`)
                                    }}
                                >
                                    Profile
                                </div>}
                            {userProfile.role === 'ADMIN' && title !== "Admin dashboard" && (
                                <div className="cursor-pointer py-1 px-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded transition-colors"
                                    onClick={() => {
                                        setDropOpen(false);
                                        navigate(`/admin`)
                                    }}
                                >
                                    Admin Dashboard
                                </div>
                            )}
                            <div className="cursor-pointer py-1 px-2 text-sm font-medium text-red-600 hover:bg-gray-100 rounded transition-colors flex items-center justify-between"
                                onClick={() => handleLogout()}
                            >
                                Logout <IoMdLogOut className="text-lg" />
                            </div>
                            {userProfile.role === "ADMIN" && title !== "System health" && (
                                <div className="cursor-pointer py-1 px-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded transition-colors"
                                    onClick={() => {
                                        setDropOpen(false);
                                        navigate(`/health`)
                                    }}
                                >
                                    Health check
                                </div>
                            )}
                        </div>
                    )}
                </div>
                :
                <Link
                    to="/register"
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-black px-3 py-2 rounded-xl font-bold transition-all shadow-sm cursor-pointer"            >
                    <span>SignUp</span>
                    <FaArrowRight className="group-hover:translate-x-0.5 transition duration-200" />
                </Link>}
        </div>
    );
}
