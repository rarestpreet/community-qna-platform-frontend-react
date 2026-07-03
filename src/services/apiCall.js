import api from "../util/axiosConfig"
import logging from "../util/logHandler"

// ── Feed ──────────────────────────────────────────────────────
const getFeed = async (setLoading, setFeedData) => {
    setLoading(true)

    try {
        const response = await api.get("/")

        await setFeedData(response?.data || [])
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
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

const getUserQuestion = async (username, setLoading, setUserQuestions) => {
    setLoading(true)

    try {
        const response = await api.get(`/profile/${username}/questions`)

        setUserQuestions(response.data || [])
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const getUserAnswer = async (username, setLoading, setUserAnswers) => {
    setLoading(true)

    try {
        const response = await api.get(`/profile/${username}/answers`)

        setUserAnswers(response?.data || [])
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const getUserComment = async (username, setLoading, setUserComments) => {
    setLoading(true)

    try {
        const response = await api.get(`/profile/${username}/comments`)

        setUserComments(response.data || [])
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

// ── Posts ──────────────────────────────────────────────────────
const getQuestionDetails = async (postId, setLoading, setQuestion) => {
    setLoading(true)

    try {
        const response = await api.get(`/post/${postId}`)

        setQuestion(response.data || {})
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const postQuestion = async (questionDetails, setLoading) => {
    setLoading(true)

    try {
        const response = await api.post(
            "/post/ask",
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

const postAnswer = async (postId, body, setLoading) => {
    setLoading(true)

    try {
        const response = await api.post(
            `/post/${postId}/answer`,
            { body }
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

const updateAnswer = async (postId, body, setLoading) => {
    setLoading(true)

    try {
        const response = await api.put(
            `/post/answer/${postId}`,
            { body }
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
            `/post/answer/${postId}`
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
            `/post/question/${postId}`,
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
            `/post/question/${postId}`
        )

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    }
}

// ── Comments ──────────────────────────────────────────────────
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
const submitVote = async (voteData, setLoading) => {
    setLoading(true)

    try {
        const response = await api.post("/vote", voteData)

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
    }
}

// ── Tags ──────────────────────────────────────────────────────
const getAllTags = async (setLoading, setTags) => {
    setLoading(true)

    try {
        const response = await api.get("/tag")

        await setTags(response?.data || [])
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    } finally {
        setLoading(false)
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

// ── Health ────────────────────────────────────────────────────
const checkHealthPing = async () => {
    try {
        const response = await api.get("/health")

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    }
}

const checkHealthSendCookie = async () => {
    try {
        const response = await api.post("/health/cors")

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    }
}

const checkHealthCors = async () => {
    try {
        const response = await api.get("/health/cors")

        return response?.data
    } catch (ex) {
        logging.errorHandler(ex?.response?.data)

        return ex?.response.data
    }
}


const toggleAnswerStatus = async (toggleDetails, setLoading) => {
    setLoading(true)

    try {
        const response = await api.post(
            "/post/toggleStatus",
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
    getQuestionDetails,
    postAnswer,
    getAllTags,
    createNewTag,
    postQuestion,
    postComment,
    deleteComment,
    submitVote,
    checkHealthPing,
    checkHealthSendCookie,
    checkHealthCors,
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
    resetPassword
}

export default apiCall