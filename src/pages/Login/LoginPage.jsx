import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { FaExclamationCircle, FaInfoCircle } from "react-icons/fa"
import AuthInput from "../../components/ui/AuthInput"
import BrandContainer from "../../components/ui/BrandContainer"
import apiCall from "../../services/apiCall"
import { useUserContext } from "../../context/userContext"

function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState("")
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { loading, setLoading, setUserProfile } = useUserContext()

    const sessionExpired = searchParams.get("expired") === "true"

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoginError("")

        const response = await apiCall.loginUser({
            email: email,
            password: password
        }, setLoading, navigate, setUserProfile)

        // If response is an error object (not a plain string success message)
        if (response && typeof response !== "string") {
            const msg = response?.message || "Login failed. Please try again."
            setLoginError(msg)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left panel — green branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-brand-500 flex-col justify-center items-center p-12 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-20 -left-20 w-64 h-64 bg-brand-400/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-brand-600/30 rounded-full blur-3xl" />

                <div className="relative z-10 text-center">
                    <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                        Ask. Answer.<br />Grow.
                    </h1>
                    <p className="text-white/80 text-lg max-w-sm leading-relaxed">
                        Join a community of developers and curious minds.
                        Share knowledge, solve problems, and level up together.
                    </p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile brand header */}
                    <div className="flex justify-center mb-8 lg:hidden">
                        <BrandContainer />
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Sign in to continue to HearMeOut
                        </p>

                        {/* Session expired notice */}
                        {sessionExpired && (
                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm font-medium mb-5 animate-[fadeIn_200ms_ease-out]">
                                <FaInfoCircle className="shrink-0 text-amber-500" />
                                Your session has expired. Please sign in again.
                            </div>
                        )}

                        {/* Login error banner */}
                        {loginError && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-5 animate-[fadeIn_200ms_ease-out]">
                                <FaExclamationCircle className="shrink-0 text-red-500" />
                                {loginError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            <AuthInput
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="flex flex-col gap-1">
                                <AuthInput
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Link
                                    className="self-end text-xs text-brand-600 hover:text-brand-700 hover:underline font-bold"
                                    to="/profile/reset-password"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="mt-3 w-full bg-black text-white font-bold text-lg py-3 rounded-xl
                                    hover:bg-gray-800 transition-colors shadow-md active:scale-[0.98] cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <div className="text-center text-sm font-medium text-gray-600 mt-6">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-brand-600 hover:text-brand-700 hover:underline font-bold">
                                Create one
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage