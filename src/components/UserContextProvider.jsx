import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { userContext } from "../context/userContext"
import apiCall from "../services/apiCall"
import { registerSessionExpiredCallback } from "../util/axiosConfig"

function UserContextProvider({ children }) {
    const [userProfile, setUserProfile] = useState({
        userId: 0,
        username: "",
        accountVerified: false,
        roles: [],
    })
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Track whether the user was ever logged in so we only redirect
    // authenticated users — not guests — when their session expires.
    const [wasLoggedIn, setWasLoggedIn] = useState(false)

    const handleSessionExpired = useCallback(() => {
        if (wasLoggedIn) {
            setUserProfile({ userId: 0, username: "", accountVerified: false, roles: [] })
            navigate("/login?expired=true")
        }
    }, [wasLoggedIn, navigate])

    // Re-register the callback whenever wasLoggedIn / navigate changes
    useEffect(() => {
        registerSessionExpiredCallback(handleSessionExpired)
    }, [handleSessionExpired])

    // Track when the user becomes logged in
    useEffect(() => {
        if (userProfile.username) {
            setWasLoggedIn(true)
        }
    }, [userProfile.username])

    useEffect(() => {
        const fetchUserDetails = async () => {
            await apiCall.getUserDetails(setLoading, setUserProfile)
        }

        fetchUserDetails()
    }, [])

    const contextValue = {
        loading, setLoading,
        userProfile, setUserProfile
    }

    return (
        <userContext.Provider value={contextValue}>
            {children}
        </userContext.Provider>
    )
}

export default UserContextProvider