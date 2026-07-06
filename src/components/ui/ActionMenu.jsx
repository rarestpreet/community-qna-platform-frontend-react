import { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaFlag, FaTrash, FaEdit, FaShareAlt } from 'react-icons/fa';

export default function ActionMenu({ operable, canReport, onEdit, onDelete, onReport, onShare }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const options = [
        { label: "Edit", icon: FaEdit, onClick: onEdit || (() => {}), show: operable },
        { label: "Delete", icon: FaTrash, onClick: onDelete || (() => {}), danger: true, show: operable },
        { label: "Report", icon: FaFlag, onClick: onReport || (() => {}), danger: true, show: canReport },
        { label: "Share", icon: FaShareAlt, onClick: onShare || (() => {}), show: true },
    ];

    const visibleOptions = options.filter(opt => opt.show !== false);

    if (visibleOptions.length === 0) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-500 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Options"
            >
                <FaEllipsisV className="text-xs" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-10 w-36 bg-white border border-gray-100 shadow-xl rounded-xl p-1 z-10 animate-[fadeIn_150ms_ease-out]">
                    {visibleOptions.map((opt, idx) => {
                        const Icon = opt.icon;
                        return (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                    opt.onClick?.();
                                }}
                                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${opt.danger
                                    ? "text-danger-600 hover:bg-danger-50"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {Icon && <Icon className="text-xs" />}
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
