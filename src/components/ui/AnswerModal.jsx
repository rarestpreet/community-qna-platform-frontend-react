import { useState } from "react"
import apiCall from "../../services/apiCall"
import { LANGUAGES, OS_OPTIONS, FRAMEWORKS_BY_LANGUAGE } from "../../util/constants"

function CharCounter({ current, min, max }) {
    const isOver = current > max
    const isUnder = current < min
    const color = isOver
        ? "text-red-500"
        : isUnder && current > 0
            ? "text-amber-500"
            : "text-gray-400"

    return (
        <span className={`text-xs font-medium tabular-nums ${color}`}>
            {current} / {max}
        </span>
    )
}

function AnswerModal({ initialSolution = {}, onClose, operation, postId }) {
    const [explanation, setExplanation] = useState(initialSolution?.explanation || "")
    const [language, setLanguage] = useState(initialSolution?.language || "")
    const [languageVersion, setLanguageVersion] = useState(initialSolution?.languageVersion || "")
    const [framework, setFramework] = useState(initialSolution?.framework || "")
    const [frameworkVersion, setFrameworkVersion] = useState(initialSolution?.frameworkVersion || "")
    const [os, setOs] = useState(initialSolution?.os || "")
    const [osVersion, setOsVersion] = useState(initialSolution?.osVersion || "")
    const [probableCause, setProbableCause] = useState(initialSolution?.probableCause || "")
    const [codeChange, setCodeChange] = useState(initialSolution?.codeChange || "")

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validate = () => {
        const errs = {}
        if (!explanation.trim()) errs.explanation = "Explanation is required."
        else if (explanation.length < 50 || explanation.length > 5000)
            errs.explanation = "Explanation must be between 50 and 5000 characters."

        if (!language) errs.language = "Language is required."

        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        setErrors({})

        const payload = {
            explanation, language, languageVersion,
            framework, frameworkVersion, os, osVersion,
            probableCause, codeChange
        }

        let result
        if (operation === "POST")
            result = await apiCall.postAnswer(postId, payload, setLoading)
        else
            result = await apiCall.updateAnswer(postId, payload, setLoading)

        if (result && typeof result !== "string") {
            setErrors({ submit: result?.message || "Something went wrong. Please try again." })
            return
        }

        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative animate-[fadeIn_150ms_ease-out] my-8">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold text-xl cursor-pointer"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {operation === "PUT" ? "Update your answer" : "Write your answer"}
                </h2>
                
                {errors.submit && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Environment Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                                Language <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={language}
                                onChange={(e) => {
                                    setLanguage(e.target.value);
                                    setFramework("");
                                }}
                                className={`input-field ${errors.language ? "input-error" : ""}`}
                            >
                                <option value="" disabled>Select language</option>
                                {LANGUAGES.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                            {errors.language && <p className="text-red-500 text-xs mt-1 font-medium">{errors.language}</p>}
                        </div>
                        
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                                Language Version <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={languageVersion}
                                onChange={(e) => setLanguageVersion(e.target.value)}
                                placeholder="e.g. 17, 3.11"
                                className="input-field"
                                maxLength={10}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                                Framework <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <select 
                                value={framework}
                                onChange={(e) => setFramework(e.target.value)}
                                className="input-field"
                                disabled={!language || !FRAMEWORKS_BY_LANGUAGE[language]}
                            >
                                <option value="">Select framework</option>
                                {language && FRAMEWORKS_BY_LANGUAGE[language]?.map(fw => (
                                    <option key={fw} value={fw}>{fw}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                                Framework Version <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={frameworkVersion}
                                onChange={(e) => setFrameworkVersion(e.target.value)}
                                placeholder="e.g. 3.2.1"
                                className="input-field"
                                maxLength={10}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                                OS <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <select 
                                value={os}
                                onChange={(e) => setOs(e.target.value)}
                                className="input-field"
                            >
                                <option value="">Select OS</option>
                                {OS_OPTIONS.map(osOpt => (
                                    <option key={osOpt} value={osOpt}>{osOpt}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                                OS Version <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={osVersion}
                                onChange={(e) => setOsVersion(e.target.value)}
                                placeholder="e.g. 11, 20.04"
                                className="input-field"
                                maxLength={10}
                            />
                        </div>
                    </div>

                    {/* Detailed Content */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-gray-700">
                                Probable Cause <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                        </div>
                        <textarea
                            value={probableCause}
                            onChange={(e) => setProbableCause(e.target.value)}
                            placeholder="What do you think caused this error?"
                            rows={3}
                            className="input-field resize-none"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-gray-700">
                                Explanation <span className="text-red-500">*</span>
                            </label>
                            <CharCounter current={explanation.length} min={50} max={5000} />
                        </div>
                        <textarea
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            placeholder="Share your detailed knowledge on how to solve this..."
                            rows={6}
                            maxLength={5000}
                            className={`input-field resize-none ${errors.explanation ? "input-error" : ""}`}
                        />
                        {errors.explanation && (
                            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.explanation}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-gray-700">
                                Code Change <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                        </div>
                        <textarea
                            value={codeChange}
                            onChange={(e) => setCodeChange(e.target.value)}
                            placeholder="Show the fixed code snippet here..."
                            rows={5}
                            className="input-field resize-none font-mono text-sm bg-gray-900 text-gray-100"
                        />
                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                            {loading ? "Loading..." : operation === "PUT" ? "Save changes" : "Submit Answer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AnswerModal;