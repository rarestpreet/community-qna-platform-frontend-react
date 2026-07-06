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
                <div className="flex items-start gap-3 mb-1">
                    <h1 className="text-4xl font-black tracking-tighter text-on-surface">
                        {profile?.username}
                    </h1>
                    <div className="mt-2">
                        {profile.accountVerified ? (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow-sm">
                                <FaCheckCircle /> Verified
                            </span>
                        ) : (
                            <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow-sm">
                                <FaExclamationTriangle /> Unverified
                            </span>
                        )}
                    </div>
                </div>
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
