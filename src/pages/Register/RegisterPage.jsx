import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthInput from "../../components/ui/AuthInput"
import BrandContainer from "../../components/ui/BrandContainer"
import apiCall from "../../services/apiCall"
import { useUserContext } from "../../context/userContext"

function RegisterPage() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const { loading, setLoading } = useUserContext()

    const handleRegister = async (e) => {
        e.preventDefault()
        await apiCall.registerUser({
            email: email,
            password: password,
            username: username
        }, setLoading, navigate)

        // handle errorMessage in input
    }

    return (
        <div className="min-h-screen bg-linear-to-bl from-green-500 via-green-400 to-green-700 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50">

                <div className="flex items-center justify-center bg-green-500 border-b-2 p-5">
                    <BrandContainer />
                </div>

                {/* Form */}
                <div className="px-8 py-2 flex flex-col gap-5">
                    <h2 className="text-2xl font-bold text-center text-gray-900">Create Account</h2>
                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                        <AuthInput
                            label="Username"
                            type="text"
                            placeholder="cooluser123"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={errors.username}
                        />
                        <AuthInput
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                        />
                        <AuthInput
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />

                        <button
                            type="submit"
                            className="mt-3 w-full bg-black text-white font-bold text-lg py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-md"
                            disabled={loading}
                        >
                            {loading ? "Loading" : "Sign Up"}
                        </button>
                    </form>

                    <div className="text-center text-sm font-medium text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-green-600 text-lg hover:text-green-700 hover:underline font-bold">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage