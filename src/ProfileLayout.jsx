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

    const searchParams = new URLSearchParams(location.search)
    const currentTab = searchParams.get("tab")
    const validTabs = ["edit", "verify-email", "reset-password"]

    if (validTabs.includes(currentTab)) {
        if (!userProfile?.username) {
            navigate("/login")
            return null
        }
    }

    if (currentTab === "verify-email" && userProfile?.accountVerified) {
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