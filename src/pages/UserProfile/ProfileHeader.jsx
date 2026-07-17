import { FaCheckCircle, FaExclamationTriangle, FaShareAlt, FaCheck, FaStar, FaEdit } from "react-icons/fa"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

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
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-surface rounded-2xl shadow-sm border border-surface-container p-8 relative z-10 flex flex-col md:flex-row items-start gap-8">
            
            {/* Avatar */}
            <div className="w-32 h-32 rounded-2xl border-4 border-surface bg-primary text-on-primary flex flex-shrink-0 items-center justify-center font-black text-6xl shadow-sm overflow-hidden">
                {username?.charAt(0)?.toUpperCase()}
            </div>

            {/* Info & Stats */}
            <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    
                    {/* User details */}
                    <div className="space-y-3">
                        <div>
                            <div className="relative inline-block w-max">
                                <h1 className="text-3xl font-bold text-on-surface leading-none pr-5">
                                    {profile?.fullName || "Marco V."}
                                </h1>
                                <div className="absolute -top-1 right-0">
                                    {(profile?.accountVerified || profile?.isAccountVerified) ? (
                                        <FaCheckCircle className="text-primary text-[16px]" title="Verified User" />
                                    ) : (
                                        <FaExclamationTriangle className="text-tertiary text-[16px]" title="Unverified User" />
                                    )}
                                </div>
                            </div>
                            <p className="text-on-surface-variant font-medium mt-2">@{profile?.username || username}</p>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 bg-primary-container text-on-primary-container text-xs font-semibold rounded-full border border-primary-container">
                                {profile?.profession || "Senior Backend Eng"}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-on-surface ml-2">
                                <FaStar className="text-tertiary" />
                                {profile?.reputation >= 1000 ? (profile.reputation / 1000).toFixed(1) + 'k' : (profile?.reputation || 0)} <span className="font-normal text-on-surface-variant">reputation</span>
                            </span>
                        </div>
                        
                        {/* Bio */}
                        <p className="text-on-surface text-sm leading-relaxed max-w-2xl pt-1">
                            {profile?.bio || "Passionate about distributed systems, microservices architecture, and scalable cloud solutions. Contributing to the developer community one PR at a time."}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProfileHeader
