import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaExclamationCircle } from "react-icons/fa"
import AuthInput from "../../components/ui/AuthInput"
import BrandContainer from "../../components/ui/BrandContainer"
import apiCall from "../../services/apiCall"
import { useUserContext } from "../../context/userContext"

function RegisterPage() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [globalError, setGlobalError] = useState("")
    const navigate = useNavigate()
    const { loading, setLoading } = useUserContext()

    const validate = () => {
        const errs = {}
        if (!username.trim()) errs.username = "Username is required."
        else if (username.length < 5 || username.length > 20) errs.username = "Username must be 5–20 characters."

        if (!email.trim()) errs.email = "Email is required."

        if (!password.trim()) errs.password = "Password is required."
        else if (password.length < 8 || password.length > 20) errs.password = "Password must be 8–20 characters."

        return errs
    }

    /**
     * Map backend fieldErrors array (each item is [fieldName, message])
     * to our local errors state object.
     */
    const applyApiFieldErrors = (fieldErrors) => {
        const errs = {}
        fieldErrors?.forEach(([field, message]) => {
            errs[field] = message
        })
        return errs
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setGlobalError("")

        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        setErrors({})

        const response = await apiCall.registerUser({
            username,
            email,
            password
        }, setLoading, navigate)

        // Handle API errors — response is an error object when status !== 2xx
        if (response && typeof response !== "string") {
            if (response.fieldErrors?.length > 0) {
                // Validation errors from backend — map to fields
                setErrors(applyApiFieldErrors(response.fieldErrors))
            } else if (response.error === "Username already exist") {
                setErrors({ username: response.message || "This username is already taken." })
            } else if (response.error === "Email already exist") {
                setErrors({ email: response.message || "This email is already registered." })
            } else {
                setGlobalError(response.message || "Registration failed. Please try again.")
            }
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left panel — green branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-brand-500 flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute top-20 -left-20 w-64 h-64 bg-brand-400/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-brand-600/30 rounded-full blur-3xl" />

                <div className="relative z-10 text-center">
                    <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                        Join the<br />Community
                    </h1>
                    <p className="text-white/80 text-lg max-w-sm leading-relaxed">
                        Create your account and start asking questions,
                        sharing answers, and growing your knowledge.
                    </p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-8 lg:hidden">
                        <BrandContainer />
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                            Create Account
                        </h2>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Sign up for a free HearMeOut account
                        </p>

                        {/* Global error banner */}
                        {globalError && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-5 animate-[fadeIn_200ms_ease-out]">
                                <FaExclamationCircle className="shrink-0 text-red-500" />
                                {globalError}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="flex flex-col gap-5">
                            <AuthInput
                                label="Username"
                                type="text"
                                placeholder="your_username"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setErrors(p => ({ ...p, username: "" })) }}
                                error={errors.username}
                            />
                            <AuthInput
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })) }}
                                error={errors.email}
                            />
                            <AuthInput
                                label="Password"
                                type="password"
                                placeholder="••••••••  (8–20 chars)"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })) }}
                                error={errors.password}
                            />

                            <button
                                type="submit"
                                className="mt-3 w-full bg-black text-white font-bold text-lg py-3 rounded-xl
                                    hover:bg-gray-800 transition-colors shadow-md active:scale-[0.98] cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>

                        <div className="text-center text-sm font-medium text-gray-600 mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="text-brand-600 hover:text-brand-700 hover:underline font-bold">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage