import api from "../util/axiosConfig"
import logging from "../util/logHandler"

const getFeed = async (setLoading) => {
    setLoading(true)

    try {
        const response = await api.get("/")

        return response
    } catch (ex) {
        logging.errorHandler(ex.message ? ex.message : "Network error")

        return ex
    } finally {
        setLoading(false)
    }
}

const loginUser = async (loginRequestData, setLoading, navigate, setUserProfile) => {
    try {
        const response = await api.post("/auth/login", loginRequestData)
        await getUserDetails(setLoading, setUserProfile)
        navigate("/")
    } catch (ex) {
        logging.errorHandler(ex ? ex.response : "Network error")
    } finally {
        setLoading(false)
    }
}

const registerUser = async (registerRequestData, setLoading, navigate) => {
    setLoading(true)

    try {
        const response = await api.post("/auth/register", registerRequestData)
        navigate("/")
    } catch (ex) {
        logging.errorHandler(ex ? ex.response : "Network error")
    } finally {
        setLoading(false)
    }
}

const getUserDetails = async (setLoading, setUserProfile) => {
    setLoading(true)

    try {
        const response = await api.get("/profile")

        setUserProfile(response?.data ? response.data : {})
    } catch (ex) {
        logging.errorHandler(ex ? ex.response : "Network error")
    } finally {
        setLoading(false)
    }
}

const getUserProfile = async (setLoading) => {
    setLoading(true)

    try {
        const response = await api.get(`/profile/${id}`)

        return response
    } catch (ex) {
        logging.errorHandler(ex.message ? ex.message : "Network error")

        return ex
    } finally {
        setLoading(false)
    }
}

const terminateSession = async (setLoading, setUserProfile) => {
    setLoading(true)

    try {
        const response = await api.post("/auth/logout")
        console.log(response)

        setUserProfile({})
    } catch (ex) {
        logging.errorHandler(ex.message ? ex.message : "Network error")

        return ex
    } finally {
        setLoading(false)
    }
}

const apiCall = {
    getFeed,
    loginUser,
    registerUser,
    getUserDetails,
    getUserProfile,
    terminateSession
}

export default apiCall