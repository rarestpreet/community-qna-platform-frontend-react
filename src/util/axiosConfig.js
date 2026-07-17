import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
})

// ── Session-expiry callback registry ──────────────────────────
let onSessionExpired = null

/**
 * Register a callback to be invoked when both the access token
 * and the refresh token have expired (i.e. silent refresh failed).
 * Called from UserContextProvider on mount.
 */
export const registerSessionExpiredCallback = (cb) => {
    onSessionExpired = cb
}
export const triggerSessionExpired = (error) => {
    if (onSessionExpired) {
        onSessionExpired(error)
    }
}

// ── Silent refresh interceptor ─────────────────────────────────
let isRefreshing = false
let pendingRequests = []

const processPendingRequests = (error) => {
    pendingRequests.forEach(({ resolve, reject }) => {
        if (error) reject(error)
        else resolve()
    })
    pendingRequests = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Only intercept 401 responses, but not the refresh-token call itself
        // to avoid an infinite retry loop.
        const isRefreshCall = originalRequest?.url?.includes("/auth/refresh-token")
        const is401 = error.response?.status === 401

        if (!is401 || isRefreshCall || originalRequest._retried) {
            return Promise.reject(error)
        }

        // Mark so we don't retry again
        originalRequest._retried = true

        if (isRefreshing) {
            // Queue the original request while a refresh is in progress
            return new Promise((resolve, reject) => {
                pendingRequests.push({ resolve, reject })
            }).then(() => api(originalRequest))
              .catch((err) => Promise.reject(err))
        }

        isRefreshing = true

        try {
            await api.get("/auth/refresh-token")
            processPendingRequests(null)
            return api(originalRequest)
        } catch (refreshError) {
            processPendingRequests(refreshError)
            // Both tokens expired — notify the app
            triggerSessionExpired(refreshError)
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    }
)

export default api