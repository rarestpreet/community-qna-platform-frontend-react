import React, { useState } from 'react';
import { FaExclamationTriangle } from "react-icons/fa";

export default function AuthInput({ label, type, value, onChange, placeholder, error }) {
    const [isErrorHovered, setIsErrorHovered] = useState(false);

    return (
        <div className="flex flex-col gap-1.5 w-full relative text-left">
            {label && <label className="text-sm font-bold text-on-surface">{label}</label>}
            <div className="relative flex items-center">
                <input
                    type={type || "text"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all duration-200 text-on-surface ${
                        error 
                            ? "border-error focus:border-error bg-error-container/20 pr-10" 
                            : "border-outline-variant focus:border-primary bg-surface-container-low focus:bg-surface-container-lowest"
                    }`}
                />
                
                {/* Error Icon & Tooltip */}
                {error && (
                    <div 
                        className="absolute right-3 flex items-center justify-center cursor-help"
                        onMouseEnter={() => setIsErrorHovered(true)}
                        onMouseLeave={() => setIsErrorHovered(false)}
                    >
                        <FaExclamationTriangle className="text-error text-lg hover:brightness-90 transition-colors" />
                        
                        {/* Tooltip */}
                        {isErrorHovered && (
                            <div className="absolute right-0 bottom-full mb-2 w-max max-w-[200px] sm:max-w-xs px-3 py-2 bg-error text-on-error text-xs font-semibold rounded-md shadow-lg z-20 pointer-events-none text-center
                                after:content-[''] after:absolute after:top-full after:right-1.5 after:border-4 after:border-transparent after:border-t-error">
                                {error}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
