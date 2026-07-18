import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaEnvelope, FaSave, FaTrash, FaExclamationTriangle, FaTimes, FaCheckCircle } from "react-icons/fa"
import apiCall from "../../services/apiCall"
import TabLoader from "../../components/ui/TabLoader"
import DictionaryPillInput from "../../components/ui/DictionaryPillInput"
import { useUserProfileContext } from "../../context/userProfileContext"

/* ── Delete Confirmation Modal ─────────────────────────── */
function DeleteConfirmModal({ onConfirm, onCancel, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 w-full max-w-md animate-[fadeIn_150ms_ease-out]">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <FaExclamationTriangle className="text-3xl text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Delete Account</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            This action is <span className="font-semibold text-red-600">permanent and irreversible</span>.
                            All your questions, answers, comments, and votes will be permanently deleted.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full mt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 btn-secondary flex items-center justify-center gap-2"
                        >
                            <FaTimes className="text-xs" />
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FaTrash className="text-xs" />
                            {loading ? "Deleting…" : "Yes, Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Page ──────────────────────────────────────────────── */
export default function EditProfilePage() {
    const navigate = useNavigate()
    const { loading, userProfile, setLoading, setUserProfile } = useUserProfileContext()

    const [username, setUsername] = useState(userProfile.username || "")
    const [email, setEmail] = useState(userProfile.email || "")
    const [fullName, setFullName] = useState(userProfile.fullName || "")
    const [bio, setBio] = useState(userProfile.bio || "")
    const [profession, setProfession] = useState(userProfile.profession || "")
    const [errors, setErrors] = useState({})
    const [successMsg, setSuccessMsg] = useState("")
    const [saveLoading, setSaveLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    useEffect(() => {
        if (userProfile?.username) {
            setUsername(userProfile.username || "")
            setEmail(userProfile.email || "")
            setFullName(userProfile.fullName || "")
            setBio(userProfile.bio || "")
            setProfession(userProfile.profession || "")
        }
    }, [userProfile])

    if (loading) {
        return (
            <main className="flex-1 h-full bg-surface pb-12 overflow-y-auto flex items-center justify-center">
                <TabLoader rows={3} />
            </main>
        )
    }

    if (!userProfile?.username) return null

    /* ── Validation ── */
    const validate = () => {
        const errs = {}
        if (!username.trim()) errs.username = "Username is required."
        else if (username.length < 3 || username.length > 30)
            errs.username = "Username must be 3–30 characters."
        else if (!/^[a-zA-Z0-9_]+$/.test(username))
            errs.username = "Only letters, numbers and underscores are allowed."

        if (!email.trim()) errs.email = "Email is required."
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errs.email = "Please enter a valid email address."

        if (!fullName.trim()) errs.fullName = "Full Name is required."

        return errs
    }

    /* ── Save handler ── */
    const handleSave = async (e) => {
        e.preventDefault()
        setSuccessMsg("")
        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }
        setErrors({})

        const result = await apiCall.updateUserProfile(userProfile.username, { username, email, fullName, bio, profession }, setSaveLoading)
        if (result?.username) {
            await apiCall.getUserDetails(setLoading, setUserProfile)
            setSuccessMsg("Profile updated successfully!")
            setTimeout(() => setSuccessMsg(""), 4000)
        }
    }

    /* ── Delete handler ── */
    const handleDeleteConfirm = async () => {
        await apiCall.deleteUserAccount(setDeleteLoading)
        setUserProfile({})
        navigate("/")
    }

    const hasChanges =
        username !== (userProfile.username || "") ||
        email !== (userProfile.email || "") ||
        fullName !== (userProfile.fullName || "") ||
        bio !== (userProfile.bio || "") ||
        profession !== (userProfile.profession || "")

    return (
        <main className="flex-1 h-full bg-surface pb-12 overflow-y-auto">

            {/* Hero banner — matches UserProfilePage */}
            <header className="relative">
                <div className="h-48 w-full hero-gradient" />
                <div className="max-w-6xl mx-auto px-8 relative">
                    {/* Avatar */}
                    <div className="absolute -bottom-10 left-0">
                        <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-bold text-4xl shadow-lg border-4 border-surface select-none">
                            {userProfile.username[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <section className="max-w-6xl mx-auto px-8 mt-4">
                {/* Push content below avatar */}
                <div className="mt-14">
                    <h1 className="text-2xl font-bold text-on-surface">Edit Profile</h1>
                    <p className="text-sm text-on-surface-variant mt-1">
                        Update your public profile details and account settings.
                    </p>
                </div>

                <div className="mt-8 max-w-xl flex flex-col gap-6">

                    {/* Success banner */}
                    {successMsg && (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium animate-[fadeIn_200ms_ease-out]">
                            <FaCheckCircle className="text-green-500 shrink-0" />
                            {successMsg}
                        </div>
                    )}

                    {/* Form card */}
                    <form onSubmit={handleSave} className="card p-6 flex flex-col gap-5" noValidate>

                        {/* Username */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="edit-username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FaUser className="text-brand-500 text-xs" />
                                Username
                            </label>
                            <input
                                id="edit-username"
                                type="text"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setErrors(p => ({ ...p, username: "" })) }}
                                maxLength={30}
                                placeholder="Your username"
                                className={`input-field ${errors.username ? "input-error" : ""}`}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs font-medium">{errors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="edit-email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FaEnvelope className="text-brand-500 text-xs" />
                                Email
                            </label>
                            <input
                                id="edit-email"
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })) }}
                                placeholder="your@email.com"
                                className={`input-field ${errors.email ? "input-error" : ""}`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs font-medium">{errors.email}</p>
                            )}
                        </div>

                        {/* Full Name */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="edit-fullname" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FaUser className="text-brand-500 text-xs" />
                                Full Name
                            </label>
                            <input
                                id="edit-fullname"
                                type="text"
                                value={fullName}
                                onChange={(e) => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: "" })) }}
                                maxLength={100}
                                placeholder="John Doe"
                                className={`input-field ${errors.fullName ? "input-error" : ""}`}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-xs font-medium">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label htmlFor="edit-bio" className="text-sm font-semibold text-gray-700">Bio (Optional)</label>
                                {!userProfile.bio && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Recommended</span>}
                            </div>
                            <textarea
                                id="edit-bio"
                                value={bio}
                                onChange={(e) => { setBio(e.target.value); setErrors(p => ({ ...p, bio: "" })) }}
                                maxLength={255}
                                placeholder="Tell us about yourself..."
                                className={`input-field resize-y min-h-[80px] ${errors.bio ? "input-error" : ""}`}
                            />
                        </div>

                        {/* Profession */}
                        <div className="flex flex-col gap-1.5 mb-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-gray-500 italic">Select your profession to help others know your background.</span>
                                {!userProfile.profession && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Recommended</span>}
                            </div>
                            <DictionaryPillInput
                                type="profession"
                                label="Profession (Optional)"
                                value={profession}
                                onChange={(val) => setProfession(val)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saveLoading}
                                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaSave className="text-xs" />
                                {saveLoading ? "Saving…" : "Save Changes"}
                            </button>
                        </div>
                    </form>

                    {/* Danger Zone */}
                    <div className="card p-6 border border-red-100 flex flex-col gap-3">
                        <div>
                            <h2 className="text-base font-bold text-red-600 flex items-center gap-2">
                                <FaExclamationTriangle className="text-sm" />
                                Danger Zone
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Deleting your account is permanent. All your data will be erased and cannot be recovered.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="self-start flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm px-4 py-2.5 rounded-xl border border-red-200 transition-colors cursor-pointer"
                        >
                            <FaTrash className="text-xs" />
                            Delete My Account
                        </button>
                    </div>

                </div>
            </section>

            {showDeleteModal && (
                <DeleteConfirmModal
                    loading={deleteLoading}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </main>
    )
}
