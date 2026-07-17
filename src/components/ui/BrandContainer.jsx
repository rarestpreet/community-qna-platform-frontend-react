import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTerminal } from "react-icons/fa";

function BrandContainer() {
    const location = useLocation();
    const navigate = useNavigate();

    const isHomePage = location.pathname === "/";

    return (
        isHomePage ? (
            <Link
                to="/"
                className="flex items-center gap-2 no-underline group"
            >
                <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <FaTerminal className="text-sm" />
                </div>
                <span className="text-2xl font-extrabold text-on-surface tracking-tight">
                    HearMe<span className="text-primary">Out</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse mt-2" />
            </Link>
        ) : (
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer"
            >
                <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                Back
            </button>
        )
    );
}

export default BrandContainer;