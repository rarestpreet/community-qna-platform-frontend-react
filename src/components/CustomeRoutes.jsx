import { Navigate, Outlet } from "react-router-dom"
import { useUserContext } from "../context/userContext"

export function AdminOnly() {
    const { userProfile } = useUserContext()

    if (userProfile?.roles === "ADMIN") {
        return <Outlet />
    }

    return <Navigate to="/" replace />
}

export function AuthenticatedOnly() {
    const { userProfile, loading } = useUserContext()

    if (loading) return null; // or a spinner

    if (userProfile?.username) {
        return <Outlet />
    }

    return <Navigate to="/login" replace />
}