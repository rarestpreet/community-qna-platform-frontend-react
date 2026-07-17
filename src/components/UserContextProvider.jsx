import { useEffect, useState, useCallback, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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
    const location = useLocation()
    const lastValidatedTime = useRef(Date.now())

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

    // ── Heartbeat: Silent refresh every 15 mins if logged in ──
    useEffect(() => {
        if (!userProfile.username) return;

        const interval = setInterval(() => {
            apiCall.silentRefresh();
            lastValidatedTime.current = Date.now();
        }, 15 * 60 * 1000); // 15 minutes

        return () => clearInterval(interval);
    }, [userProfile.username]);

    // ── Throttled Route-Change Validator ──
    useEffect(() => {
        if (!userProfile.username) return;

        console.log(location.pathname);

        const now = Date.now();
        const timeSinceLastValidation = now - lastValidatedTime.current;

        // If it's been more than 5 minutes since we last validated, do a silent refresh
        if (timeSinceLastValidation > 5 * 60 * 1000) {
            // We do a silent refresh without throwing toasts on failure
            apiCall.silentRefresh(false);
            lastValidatedTime.current = now;
        }
    }, [location.pathname, userProfile.username]);

    useEffect(() => {
        const initializeSession = async () => {
            // Attempt a silent refresh to exchange a valid refresh token for a fresh access token.
            // We suppress errors here because guests will naturally fail this call.
            await apiCall.silentRefresh(false)
            await apiCall.getUserDetails(setLoading, setUserProfile)
        }

        initializeSession()
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