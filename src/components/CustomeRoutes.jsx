import { Navigate, Outlet } from "react-router-dom"
import { useUserContext } from "../context/userContext"

export function AdminOnly() {
    const { userProfile } = useUserContext()

    if (userProfile?.roles === "ADMIN") {
        return <Outlet />
    }

    return <Navigate to="/" replace />
}

export function GuestOnly() {
    const { userProfile } = useUserContext()

    if (!userProfile?.roles) {
        return <Outlet />
    }

    return <Navigate to="/" replace />
}

export function RequireAuth() {
    const { userProfile } = useUserContext()

    if (userProfile?.roles) {
        return <Outlet />
    }

    return <Navigate to="/login" replace />
}

export function RequireVerified() {
    const { userProfile } = useUserContext()

    if (userProfile?.roles === "VERIFIED_USER" || userProfile?.roles === "ADMIN") {
        return <Outlet />
    }

    if (userProfile?.roles === "USER") {
        return <Navigate to={`/profile/${userProfile.username}/verify-email`} replace />
    }

    return <Navigate to="/login" replace />
}