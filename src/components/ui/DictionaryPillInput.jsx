import React, { useState, useEffect } from "react"
import { FaSearch } from "react-icons/fa"
import apiCall from "../../services/apiCall"

function DictionaryPillInput({ type, value, onChange, label, placeholder }) {
    const [options, setOptions] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTopValues = async () => {
            const res = await apiCall.getDictionaryValues(type, "", 10, setLoading)
            if (res?.success) {
                setOptions(res.data)
            }
        }
        fetchTopValues()
    }, [type])

    const handleSearch = async (e) => {
        const term = e.target.value
        setSearch(term)
        
        // Let the user set their own custom typed value if they want
        onChange(term)

        // Future: Could debounce API call here for search
    }

    const selectPill = (pillValue) => {
        setSearch("")
        onChange(pillValue)
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="text-sm font-semibold text-on-surface">{label}</label>}
            
            <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                    type="text"
                    placeholder={placeholder || `Search or type custom ${type}...`}
                    value={search || value || ""}
                    onChange={handleSearch}
                    className="w-full bg-surface-variant/50 border border-outline focus:border-primary rounded-xl px-10 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-1">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => selectPill(opt)}
                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                            value === opt
                                ? "bg-primary text-on-primary border-primary"
                                : "bg-surface text-on-surface-variant border-outline hover:bg-surface-variant"
                        }`}
                    >
                        {opt}
                    </button>
                ))}
                {loading && <span className="text-xs text-on-surface-variant py-1 animate-pulse">Loading...</span>}
            </div>
        </div>
    )
}

export default DictionaryPillInput
