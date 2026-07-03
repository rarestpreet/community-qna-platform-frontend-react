import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaEnvelope, FaKey, FaCheckCircle, FaPaperPlane, FaLock, FaExclamationCircle } from "react-icons/fa"
import apiCall from "../../services/apiCall"
import TabLoader from "../../components/ui/TabLoader"
import { useUserProfileContext } from "../../context/userProfileContext"

const RESEND_COOLDOWN = 60 // seconds

export default function ResetPasswordPage() {

    const navigate = useNavigate()
    const { loading, userProfile, setLoading, setUserProfile } = useUserProfileContext()

    const [email, setEmail] = useState(userProfile.email || "")
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [sendLoading, setSendLoading] = useState(false)
    const [resetLoading, setResetLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [globalError, setGlobalError] = useState("")

    // Countdown timer state
    const [cooldown, setCooldown] = useState(0)
    const timerRef = useRef(null)

    // Cleanup timer on unmount
    useEffect(() => {
        return () => clearInterval(timerRef.current)
    }, [])

    if (loading) {
        return (
            <main className="flex-1 h-full bg-surface pb-12 overflow-y-auto flex items-center justify-center">
                <TabLoader rows={3} />
            </main>
        )
    }

    const isLoggedIn = !!userProfile?.username

    const startCooldown = () => {
        setCooldown(RESEND_COOLDOWN)
        timerRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const handleSendOtp = async () => {
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrors({ email: "Please enter a valid email address." })
            return
        }
        setErrors({})
        setGlobalError("")
        const result = await apiCall.sendPasswordResetOtp(email, setSendLoading)
        if (typeof result === "string") {
            setOtpSent(true)
            startCooldown()
        } else if (result?.message) {
            setGlobalError(result.message)
        }
    }

    const validate = () => {
        const errs = {}
        if (!otp.trim()) errs.otp = "Please enter the OTP."
        if (!newPassword) errs.newPassword = "New password is required."
        else if (newPassword.length < 8) errs.newPassword = "Password must be at least 8 characters."
        if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match."
        return errs
    }

    const handleReset = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }
        setErrors({})
        setGlobalError("")

        const result = await apiCall.resetPassword(
            { email, otp, newPassword },
            setResetLoading
        )
        if (typeof result === "string") {
            setSuccessMsg("Password reset successfully! Redirecting…")
            if (isLoggedIn) setUserProfile({})
            setTimeout(() => navigate("/login"), 2000)
        } else if (result?.message) {
            setGlobalError(result.message)
        }
    }

    const sendBtnLabel = sendLoading
        ? "Sending…"
        : !otpSent
            ? "Send OTP"
            : cooldown > 0
                ? `Resend OTP (${cooldown}s)`
                : "Resend OTP"

    return (
        <main className="flex-1 h-full bg-surface pb-12 overflow-y-auto">

            {/* Hero banner */}
            <header className="relative">
                <div className="h-48 w-full hero-gradient" />
                <div className="max-w-6xl mx-auto px-8 relative">
                    <div className="absolute -bottom-10 left-0">
                        <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-bold text-4xl shadow-lg border-4 border-surface select-none">
                            {isLoggedIn ? userProfile.username[0].toUpperCase() : "?"}
                        </div>
                    </div>
                </div>
            </header>

            <section className="max-w-6xl mx-auto px-8 mt-4">
                <div className="mt-14">
                    <h1 className="text-2xl font-bold text-on-surface">Reset Password</h1>
                    <p className="text-sm text-on-surface-variant mt-1">
                        Enter your email, request an OTP, then set your new password.
                    </p>
                </div>

                <div className="mt-8 max-w-xl flex flex-col gap-6">

                    {/* Success */}
                    {successMsg && (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium animate-[fadeIn_200ms_ease-out]">
                            <FaCheckCircle className="text-green-500 shrink-0" />
                            {successMsg}
                        </div>
                    )}

                    {/* Global error */}
                    {globalError && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium animate-[fadeIn_200ms_ease-out]">
                            <FaExclamationCircle className="text-red-500 shrink-0" />
                            {globalError}
                        </div>
                    )}

                    <div className="card p-6 flex flex-col gap-5">

                        {/* Email field */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="reset-email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FaEnvelope className="text-brand-500 text-xs" />
                                Email Address
                            </label>
                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })) }}
                                readOnly={isLoggedIn}
                                placeholder="your@email.com"
                                className={`input-field ${isLoggedIn ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""} ${errors.email ? "input-error" : ""}`}
                            />
                            {errors.email && <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium"><FaExclamationCircle className="shrink-0" />{errors.email}</p>}
                        </div>

                        {/* Send / Resend OTP */}
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={sendLoading || (otpSent && cooldown > 0)}
                            className="self-start flex items-center gap-2 btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FaPaperPlane className="text-xs" />
                            {sendBtnLabel}
                        </button>

                        {/* OTP + new password fields — shown after sending */}
                        {otpSent && (
                            <form onSubmit={handleReset} className="flex flex-col gap-4 animate-[fadeIn_200ms_ease-out]">

                                {/* OTP */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="reset-otp" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FaKey className="text-brand-500 text-xs" />
                                        OTP Code
                                    </label>
                                    <input
                                        id="reset-otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => { setOtp(e.target.value); setErrors(p => ({ ...p, otp: "" })) }}
                                        placeholder="6-digit code"
                                        maxLength={10}
                                        className={`input-field tracking-widest font-mono ${errors.otp ? "input-error" : ""}`}
                                    />
                                    {errors.otp && <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium"><FaExclamationCircle className="shrink-0" />{errors.otp}</p>}
                                </div>

                                {/* New password */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="new-password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FaLock className="text-brand-500 text-xs" />
                                        New Password
                                    </label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value); setErrors(p => ({ ...p, newPassword: "" })) }}
                                        placeholder="At least 8 characters"
                                        className={`input-field ${errors.newPassword ? "input-error" : ""}`}
                                    />
                                    {errors.newPassword && <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium"><FaExclamationCircle className="shrink-0" />{errors.newPassword}</p>}
                                </div>

                                {/* Confirm password */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FaLock className="text-brand-500 text-xs" />
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: "" })) }}
                                        placeholder="Re-enter your new password"
                                        className={`input-field ${errors.confirmPassword ? "input-error" : ""}`}
                                    />
                                    {errors.confirmPassword && <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium"><FaExclamationCircle className="shrink-0" />{errors.confirmPassword}</p>}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resetLoading}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <FaCheckCircle className="text-xs" />
                                        {resetLoading ? "Resetting…" : "Reset Password"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}
