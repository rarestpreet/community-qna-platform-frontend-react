import { Link, useNavigate } from "react-router-dom"
import BrandContainer from "./ui/BrandContainer"
import { FaArrowRight } from "react-icons/fa"
import { useUserContext } from "../context/userContext"
import { useEffect, useRef, useState } from "react"
import { IoMdLogOut } from "react-icons/io"
import apiCall from "../services/apiCall"

function NavBar() {
    const { userProfile, setUserProfile, setLoading } = useUserContext()
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const dropDownRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutsite = (event) => {
            if (dropDownRef.current &&
                !dropDownRef.current.contains(event.target)
            ) {
                setIsDropDownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutsite)

        return () => {
            document.removeEventListener("mousedown", handleClickOutsite)
        }
    }, [])

    const handleLogout = async () => {
        const response = await apiCall.terminateSession(setLoading, setUserProfile)

        if (response) {
            console.log(response)
            navigate("/")
        }
    }

    return (
        <div className="flex justify-between items-center p-4 bg-green-500 shadow-md">
            <BrandContainer />
            {userProfile?.username ?
                <div className="relative" >
                    <div
                        className={`w-10 h-10 ${isDropDownOpen ? "bg-black" : "bg-white"} ${isDropDownOpen ? "text-white" : "text-green-600"} font-medium text-xl rounded-full flex justify-center items-center cursor-pointer shadow hover:bg-black hover:text-white transition-colors select-none`}
                        onClick={() => setIsDropDownOpen(state => !state)}
                    >
                        {userProfile.username[0].toUpperCase()}
                    </div>
                    {isDropDownOpen && (
                        <div
                            className="absolute shadow-lg bg-white rounded-md p-1 top-14 right-0 z-50 min-w-25 border border-gray-100 flex flex-col gap-1"
                            ref={dropDownRef}>
                            <div className="cursor-pointer py-1 px-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                onClick={() => {

                                }}
                            >
                                Profile
                            </div>
                            <div className="cursor-pointer py-1 px-2 text-sm font-medium text-red-600 hover:bg-gray-100 rounded transition-colors flex items-center justify-between"
                                onClick={() => handleLogout()}
                            >
                                Logout <IoMdLogOut className="text-lg" />
                            </div>
                        </div>
                    )}
                </div>
                :
                <Link
                    to="/register"
                    className="flex gap-2 border-2 rounded-xl items-center py-1 px-3 text-black group transition duration-100 hover:text-white">
                    <span className="font-medium">SignUp</span>
                    <FaArrowRight className="group-hover:translate-x-0.5 transition duration-200" />
                </Link>}
        </div>
    )
}

export default NavBar