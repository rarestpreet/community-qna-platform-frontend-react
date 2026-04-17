import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useUserContext } from "../context/userContext"
import PageLoader from "./ui/PageLoader"
import PageNavBar from "./ui/PageNavBar"

export const AdminOnly = () => {
    const { userProfile, loading } = useUserContext()
    const location = useLocation()

    if (loading) {
        return <PageLoader text="Verifying permissions..." />
    }

    if (userProfile?.role !== "ADMIN") {
        return <Navigate to="/" replace />
    }

    const title = location.pathname.includes('/health') ? "System Health" : "Admin Dashboard"

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <PageNavBar title={title} />
            <Outlet />
        </div>
    )
}