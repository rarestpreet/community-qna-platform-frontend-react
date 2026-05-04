import { Outlet, useLocation, useNavigate } from "react-router-dom"
import SideNavBar from "./components/SideNavBar"
import { useUserContext } from "./context/userContext"
import PageLoader from "./components/ui/PageLoader"
import UserProfileContextProvider from "./components/UserProfileContextProvider"

function ProfileLayout() {
    const { loading, userProfile } = useUserContext()
    const navigate = useNavigate()
    const location = useLocation()

    const isInitialLoading = loading && !userProfile?.username

    if (isInitialLoading) {
        return <PageLoader />
    }

    const path = ["edit", "verify-email", "reset-password"]

    if (path.includes(location.pathname.split("/").at(3) || "")) {
        if (!userProfile?.username) {
            navigate("/login")
            return null
        }
    }

    if (path.includes(location.pathname.split("/").at(3))) {
        if (userProfile?.username !== location.pathname.split("/").at(2)) {
            navigate(`/profile/${userProfile?.username}`)
            return null
        }
    }

    if (location.pathname.includes("verify-email") &&
        userProfile?.accountVerified) {
        navigate(`/profile/${userProfile?.username}`)
        return null
    }

    return (
        <div className="flex h-[calc(100vh-65px)] w-full overflow-hidden bg-surface">
            <SideNavBar />
            <main className="flex-1 h-full overflow-y-auto">
                <UserProfileContextProvider>
                    <Outlet />
                </UserProfileContextProvider>
            </main>
        </div>
    )
}

export default ProfileLayout