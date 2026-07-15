import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa"

/**
 * ProfileHeader — avatar, user info, reputation, and action buttons.
 * Props:
 *  - userProfile: UserProfileResponseDTO {
        userId: 0,
        username: "",
        reputation: 0,
        createdAt: "",
        operable: false,
        accountVerified: false,
        accountTerminated: false
    }
 *   - username: string (from route params)
 *   - onChangePassword: () => void
 *   - onVerifyEmail: () => void
 */
function ProfileHeader({ profile, username }) {

    return (
        <div className="flex items-end -mt-16 gap-8 mb-8">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-[6px] border-surface-container-low bg-surface-container-lowest flex items-center justify-center text-brand-400 font-black text-4xl shadow-sm">
                {username?.charAt(0)?.toUpperCase()}
            </div>

            {/* Info */}
            <div className="pb-2 flex-1">
                <h1 className="text-4xl font-black tracking-tighter text-on-surface mb-1 flex items-center gap-3">
                    {profile?.username}
                    {profile.accountVerified ? (
                        <FaCheckCircle className="text-green-500 text-2xl" title="Verified User" />
                    ) : (
                        <FaExclamationTriangle className="text-yellow-500 text-2xl" title="Unverified User" />
                    )}
                </h1>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pb-2">
                <div className="text-center">
                    <div className="text-2xl font-black text-primary">{profile?.reputation ?? "—"}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Reputation</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-black text-on-surface">{profile?.createdAt ?? "—"}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Joined</div>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader
