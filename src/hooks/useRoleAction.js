import { useUserContext } from "../context/userContext";

const useRoleAction = () => {
    const { userProfile } = useUserContext();

    const requireRole = (allowedRoles, actionCallback) => {
        const userRole = userProfile?.roles; // Single valued string e.g. "USER"

        if (allowedRoles.includes(userRole)) {
            actionCallback();
        } else if (!userRole) {
            alert("You must be logged in to perform this action.");
        } else if (userRole === "USER") {
            alert("Please verify your email to perform this action.");
        } else {
            alert("You do not have permission to perform this action.");
        }
    };

    return { requireRole };
};

export default useRoleAction;
