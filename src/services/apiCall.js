import api, { triggerSessionExpired } from "../util/axiosConfig"
import logging from "../util/logHandler"

// ── Feed ──────────────────────────────────────────────────────
const getFeed = async (limit, offset, setLoading) => {
    setLoading && setLoading(true)

    try {
        const response = await api.get(`/?limit=${limit}&offset=${offset}`)

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return null
    } finally {
        setLoading && setLoading(false)
    }
}

// ── Auth ──────────────────────────────────────────────────────
const loginUser = async (loginRequestData, setLoading, navigate, setUserProfile) => {
    setLoading(true)

    try {
        const response = await api.post("/auth/login", loginRequestData)

        await getUserDetails(setLoading, setUserProfile)
        navigate("/")
        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const registerUser = async (registerRequestData, setLoading, navigate) => {
    setLoading(true)

    try {
        const response = await api.post("/auth/register", registerRequestData)

        navigate("/")
        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const terminateSession = async (setLoading, setUserProfile) => {
    setLoading(true)

    try {
        const response = await api.post("/auth/logout")

        setUserProfile({})
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const silentRefresh = async (showError = true) => {
    try {
        await api.get("/auth/refresh-token")
        return true
    } catch (ex) {
        if (showError) {
            logging.errorHandler(ex?.response?.data || "Silent refresh failed")
        }
        triggerSessionExpired(ex)
        return false
    }
}

// ── User Profile ──────────────────────────────────────────────
const getUserDetails = async (setLoading, setUserProfile) => {
    setLoading(true)

    try {
        const response = await api.get("/profile")

        setUserProfile(response?.data || {})
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const getUserProfile = async (username, setLoading, setUserProfile) => {
    setLoading(true)

    try {
        const response = await api.get(`/profile/${username}`)

        setUserProfile(response?.data || {})
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const getUserQuestion = async (username, limit, offset, setLoading) => {
    setLoading && setLoading(true)

    try {
        const response = await api.get(`/profile/${username}/error-reports?limit=${limit}&offset=${offset}`)

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return null
    } finally {
        setLoading && setLoading(false)
    }
}

const getUserAnswer = async (username, limit, offset, setLoading) => {
    setLoading && setLoading(true)

    try {
        const response = await api.get(`/profile/${username}/solutions?limit=${limit}&offset=${offset}`)

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return null
    } finally {
        setLoading && setLoading(false)
    }
}

const getUserComment = async (username, limit, offset, setLoading) => {
    setLoading && setLoading(true)

    try {
        const response = await api.get(`/profile/${username}/comments?limit=${limit}&offset=${offset}`)

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return null
    } finally {
        setLoading && setLoading(false)
    }
}

// ── Posts ──────────────────────────────────────────────────────
const getQuestionDetails = async (postId, limit, offset, setLoading) => {
    setLoading && setLoading(true)

    try {
        const response = await api.get(`/error-report/${postId}?limit=${limit}&offset=${offset}`)

        console.log("[getQuestionDetails] response:", response?.data)
        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return null
    } finally {
        setLoading && setLoading(false)
    }
}

const getPostAnswers = async (postId, limit, offset, setLoading) => {
    setLoading && setLoading(true)

    try {
        const response = await api.get(`/solution/error-report/${postId}?limit=${limit}&offset=${offset}`)

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return null
    } finally {
        setLoading && setLoading(false)
    }
}

const postQuestion = async (questionDetails, setLoading) => {
    setLoading(true)

    try {
        const response = await api.post(
            "/error-report",
            questionDetails
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const postAnswer = async (postId, solutionDetails, setLoading) => {
    setLoading(true)

    try {
        const response = await api.post(
            `/solution/error-report/${postId}`,
            solutionDetails
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const updateAnswer = async (postId, solutionDetails, setLoading) => {
    setLoading(true)

    try {
        const response = await api.put(
            `/solution/${postId}`,
            solutionDetails
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const deleteAnswer = async (postId, setLoading) => {
    setLoading(true)

    try {
        const response = await api.delete(
            `/solution/${postId}`
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const updateQuestion = async (postId, questionDetails, setLoading) => {
    setLoading(true)

    try {
        const response = await api.put(
            `/error-report/${postId}`,
            questionDetails
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const deleteQuestion = async (postId) => {
    try {
        const response = await api.delete(
            `/error-report/${postId}`
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    }
}

// ── Comments ──────────────────────────────────────────────────
const getPostComments = async (parentId, parentType, limit, offset, setLoading) => {
    setLoading && setLoading(true)

    try {
        const response = await api.get(`/comment?parentId=${parentId}&parentType=${parentType}&limit=${limit}&offset=${offset}`)

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return null
    } finally {
        setLoading && setLoading(false)
    }
}
const postComment = async (commentDetails, setCommentLoader) => {
    setCommentLoader(true)

    try {
        const response = await api.post(
            "/comment",
            commentDetails
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setCommentLoader(false)
    }
}

const updateComment = async (commentId, body, setCommentLoader) => {
    setCommentLoader(true)

    try {
        const response = await api.put(
            `/comment/${commentId}`,
            { body }
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setCommentLoader(false)
    }
}

const deleteComment = async (commentId, setCommentLoader) => {
    setCommentLoader(true)

    try {
        const response = await api.delete(`/comment/${commentId}`)

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setCommentLoader(false)
    }
}

// ── Votes ─────────────────────────────────────────────────────
const toggleVote = async (voteData, voteType, setLoading) => {
    setLoading(true)

    try {
        const response = await api.post(`/vote?voteType=${voteType}`, voteData)

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

// ── Tags ──────────────────────────────────────────────────────
const getAllTags = async (limit = 1000, offset = 0, setLoading, setTags) => {
    if (setLoading) setLoading(true)

    try {
        const response = await api.get(`/tag?limit=${limit}&offset=${offset}`)

        if (setTags) setTags(response?.data.data || [])
        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return null
    } finally {
        if (setLoading) setLoading(false)
    }
}

const createNewTag = async (tagData, setLoading) => {
    setLoading(true)

    try {
        const response = await api.post(
            "/tag",
            tagData
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

// ── Dictionary ────────────────────────────────────────────────
const getDictionaryValues = async (type, search = "", limit = 10, setLoading) => {
    if (setLoading) setLoading(true)

    try {
        const queryParams = new URLSearchParams({ limit })
        if (search) queryParams.append("search", search)
        
        const response = await api.get(`/dictionary/${type}?${queryParams.toString()}`)
        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)
        return null
    } finally {
        if (setLoading) setLoading(false)
    }
}

const toggleAnswerStatus = async (toggleDetails, setLoading) => {
    setLoading(true)

    try {
        const response = await api.post(
            "/solution/toggleStatus",
            toggleDetails
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}
// ── User Account Management ────────────────────────────────────
const updateUserProfile = async (username, profileData, setLoading) => {
    setLoading(true)

    try {
        const response = await api.put(`/profile/${username}`,
            profileData
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response?.data
    } finally {
        setLoading(false)
    }
}

const deleteUserAccount = async (setLoading) => {
    setLoading(true)

    try {
        const response = await api.delete("/profile")

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response?.data
    } finally {
        setLoading(false)
    }
}

// ── Email Verification & Password Reset ─────────────────────
const sendVerificationOtp = async (setLoading) => {
    setLoading(true)
    try {
        const response = await api.post("/mail/email-verification-otp")

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)
        return ex?.response?.data
    } finally {
        setLoading(false)
    }
}

const verifyAccount = async (otp, setLoading) => {
    setLoading(true)
    try {
        const response = await api.post("/auth/verify-account",
            { otp }
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)
        return ex?.response?.data
    } finally {
        setLoading(false)
    }
}

const sendPasswordResetOtp = async (email, setLoading) => {
    setLoading(true)
    try {
        const response = await api.post("/mail/reset-password-otp",
            { email }

        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)
        return ex?.response?.data
    } finally {
        setLoading(false)
    }
}

const resetPassword = async (payload, setLoading) => {
    setLoading(true)
    try {
        const response = await api.post("/auth/password-reset",
            payload
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)
        return ex?.response?.data
    } finally {
        setLoading(false)
    }
}

// ── Export ─────────────────────────────────────────────────────
const apiCall = {
    getFeed,
    loginUser,
    registerUser,
    getUserDetails,
    getUserProfile,
    getUserAnswer,
    getUserComment,
    getUserQuestion,
    terminateSession,
    silentRefresh,
    getQuestionDetails,
    getPostAnswers,
    getPostComments,
    postAnswer,
    getAllTags,
    createNewTag,
    postQuestion,
    postComment,
    deleteComment,
    toggleVote,

    toggleAnswerStatus,
    updateAnswer,
    deleteAnswer,
    deleteQuestion,
    updateQuestion,
    updateComment,
    updateUserProfile,
    deleteUserAccount,
    sendVerificationOtp,
    verifyAccount,
    sendPasswordResetOtp,
    resetPassword,
    getDictionaryValues
}

export default apiCall