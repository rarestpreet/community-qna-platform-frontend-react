import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaEnvelope, FaKey, FaCheckCircle, FaPaperPlane, FaExclamationCircle } from "react-icons/fa"
import apiCall from "../../services/apiCall"
import TabLoader from "../../components/ui/TabLoader"
import { useUserProfileContext } from "../../context/userProfileContext"

const RESEND_COOLDOWN = 60 // seconds

export default function VerifyEmailPage() {
    const navigate = useNavigate()
    const { loading, userProfile, setLoading, setUserProfile } = useUserProfileContext()

    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpError, setOtpError] = useState("")
    const [sendError, setSendError] = useState("")
    const [sendLoading, setSendLoading] = useState(false)
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")

    // Countdown timer state
    const [cooldown, setCooldown] = useState(0)
    const timerRef = useRef(null)

    useEffect(() => {
        if (!loading && !userProfile?.username) navigate("/login")
    }, [loading, userProfile, navigate])

    // Cleanup timer on unmount
    useEffect(() => {
        return () => clearInterval(timerRef.current)
    }, [])

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
        setSendError("")
        const result = await apiCall.sendVerificationOtp(setSendLoading)
        if (typeof result === "string") {
            setOtpSent(true)
            setOtpError("")
            startCooldown()
        } else if (result?.message) {
            setSendError(result.message)
        }
    }

    const handleVerify = async (e) => {
        e.preventDefault()
        if (!otp.trim()) { setOtpError("Please enter the OTP."); return }
        setOtpError("")

        const result = await apiCall.verifyAccount(otp, setVerifyLoading)
        if (typeof result === "string") {
            await apiCall.getUserDetails(setLoading, setUserProfile)
            setSuccessMsg("Your email has been verified successfully!")
            setTimeout(() => navigate(`/profile/${userProfile.username}`), 2000)
        } else if (result?.message) {
            setOtpError(result.message)
        }
    }

    if (loading) {
        return (
            <main className="flex-1 h-full bg-surface pb-12 overflow-y-auto flex items-center justify-center">
                <TabLoader rows={3} />
            </main>
        )
    }

    if (!userProfile?.username) return null

    const canResend = otpSent && cooldown === 0 && !sendLoading
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
                            {userProfile.username[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <section className="max-w-6xl mx-auto px-8 mt-4">
                <div className="mt-14">
                    <h1 className="text-2xl font-bold text-on-surface">Verify Email</h1>
                    <p className="text-sm text-on-surface-variant mt-1">
                        Confirm your email address by entering the OTP sent to you.
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

                    <div className="card p-6 flex flex-col gap-5">

                        {/* Email display (immutable) */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FaEnvelope className="text-brand-500 text-xs" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={userProfile.email || ""}
                                readOnly
                                className="input-field bg-gray-50 text-gray-500 cursor-not-allowed select-none"
                            />
                            <p className="text-xs text-gray-400">This is the email that will receive the verification OTP.</p>
                        </div>

                        {/* Send / Resend OTP */}
                        <div className="flex flex-col gap-1.5">
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={sendLoading || (otpSent && cooldown > 0)}
                                className="self-start flex items-center gap-2 btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <FaPaperPlane className="text-xs" />
                                {sendBtnLabel}
                            </button>
                            {sendError && (
                                <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                                    <FaExclamationCircle className="shrink-0" />
                                    {sendError}
                                </p>
                            )}
                        </div>

                        {/* OTP input — shown after sending */}
                        {otpSent && (
                            <form onSubmit={handleVerify} className="flex flex-col gap-4 animate-[fadeIn_200ms_ease-out]">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="verify-otp" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FaKey className="text-brand-500 text-xs" />
                                        Enter OTP
                                    </label>
                                    <input
                                        id="verify-otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => { setOtp(e.target.value); setOtpError("") }}
                                        placeholder="6-digit code"
                                        maxLength={10}
                                        className={`input-field tracking-widest font-mono ${otpError ? "input-error" : ""}`}
                                    />
                                    {otpError && (
                                        <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                                            <FaExclamationCircle className="shrink-0" />
                                            {otpError}
                                        </p>
                                    )}
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
                                        disabled={verifyLoading}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <FaCheckCircle className="text-xs" />
                                        {verifyLoading ? "Verifying…" : "Verify Email"}
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
