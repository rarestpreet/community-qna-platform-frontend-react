import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import apiCall from "../../services/apiCall"
import NavBar from "../../components/NavBar"
import { LANGUAGES, OS_OPTIONS, FRAMEWORKS_BY_LANGUAGE } from "../../util/constants"
import { 
    FaArrowLeft, 
    FaSearch, 
    FaFileAlt, 
    FaCode, 
    FaEye, 
    FaCheckCircle, 
    FaInfoCircle,
    FaSync
} from "react-icons/fa"

export default function SubmitSolutionPage() {
    const { errorReportID: id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    
    // Support passing an initial solution for editing (operation = PUT)
    const initialSolution = location.state?.solution || {}
    const operation = initialSolution.id ? "PUT" : "POST"

    const [explanation, setExplanation] = useState(initialSolution?.body || "")
    const [language, setLanguage] = useState(initialSolution?.language || "")
    const [languageVersion, setLanguageVersion] = useState(initialSolution?.languageVersion || "")
    const [framework, setFramework] = useState(initialSolution?.framework || "")
    const [frameworkVersion, setFrameworkVersion] = useState(initialSolution?.frameworkVersion || "")
    const [os, setOs] = useState(initialSolution?.os || "")
    const [osVersion, setOsVersion] = useState(initialSolution?.osVersion || "")
    const [probableCause, setProbableCause] = useState(initialSolution?.probableCause || "")
    const [codeChange, setCodeChange] = useState(initialSolution?.codeChange || "")

    const [loading, setLoading] = useState(false)
    const [successState, setSuccessState] = useState(false)
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
        setLoading(true)

        const payload = {
            explanation, 
            language, 
            languageVersion,
            framework, 
            frameworkVersion, 
            os, 
            osVersion,
            probableCause, 
            codeChange
        }

        let result
        if (operation === "POST") {
            result = await apiCall.postAnswer(id, payload, setLoading)
        } else {
            result = await apiCall.updateAnswer(initialSolution.id, payload, setLoading)
        }

        if (result && typeof result !== "string") {
            setErrors({ submit: result?.message || "Something went wrong. Please try again." })
            setLoading(false)
            return
        }

        // Visual feedback
        setSuccessState(true)
        setTimeout(() => {
            navigate(`/question/${id}`)
        }, 1500)
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-on-surface font-sans antialiased selection:bg-primary selection:text-on-primary">
            <NavBar />
            
            <main className="flex-grow flex w-full max-w-[1600px] mx-auto">
                <section className="w-full p-6 md:p-12 flex justify-center">
                    <div className="w-full max-w-4xl space-y-8">
                        {/* Header */}
                        <div className="space-y-2">
                            <div 
                                className="flex items-center gap-2 text-primary font-medium hover:underline cursor-pointer w-fit"
                                onClick={() => navigate(`/question/${id}`)}
                            >
                                <FaArrowLeft className="text-sm" />
                                <span className="font-label-md text-[14px] uppercase tracking-wider font-medium">Back to Report #{id}</span>
                            </div>
                            <h1 className="font-headline-lg text-[32px] font-bold text-on-surface leading-tight">
                                {operation === "PUT" ? "Update your Solution" : "Submit a Solution"}
                            </h1>
                            <p className="font-body-md text-[16px] text-on-surface-variant">
                                Your contribution helps the community resolve technical debt faster. Be descriptive and include code where possible.
                            </p>
                        </div>

                        {errors.submit && (
                            <div className="p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-center gap-2">
                                <FaInfoCircle /> {errors.submit}
                            </div>
                        )}

                        {/* Form Card */}
                        <div className="bg-surface border border-outline-variant rounded-xl p-8 shadow-sm">
                            <form className="space-y-8" onSubmit={handleSubmit}>
                                
                                {/* Root Cause Section */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 font-headline-sm text-[20px] font-semibold text-on-surface">
                                        <FaSearch className="text-tertiary" />
                                        Probable Cause
                                    </label>
                                    <p className="font-body-sm text-[14px] text-on-surface-variant mb-2">
                                        Identify the architectural or logic flaw that led to this error. (Optional)
                                    </p>
                                    <textarea 
                                        className="w-full h-24 bg-surface-container-lowest border border-outline-variant rounded-lg p-4 font-body-md text-[16px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface resize-none" 
                                        placeholder="Explain why this happened... (e.g. Race condition in the authentication middleware during token refresh)"
                                        value={probableCause}
                                        onChange={(e) => setProbableCause(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* Explanation Section */}
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between font-headline-sm text-[20px] font-semibold text-on-surface">
                                        <div className="flex items-center gap-2">
                                            <FaFileAlt className="text-secondary" />
                                            Solution Explanation <span className="text-error">*</span>
                                        </div>
                                        <span className={`text-xs font-medium ${explanation.length > 5000 ? 'text-error' : explanation.length < 50 && explanation.length > 0 ? 'text-warning' : 'text-on-surface-variant opacity-70'}`}>
                                            {explanation.length} / 5000
                                        </span>
                                    </label>
                                    <div className={`border ${errors.explanation ? 'border-error' : 'border-outline-variant'} rounded-lg overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all`}>
                                        <div className="bg-surface-container px-4 py-2 flex items-center gap-4 border-b border-outline-variant">
                                            <span className="font-label-sm text-[12px] text-on-surface-variant opacity-70 uppercase tracking-wider ml-auto">Markdown Supported</span>
                                        </div>
                                        <textarea 
                                            className="w-full h-48 bg-surface-container-lowest border-none p-4 font-body-md text-[16px] focus:ring-0 transition-all outline-none text-on-surface resize-none" 
                                            placeholder="Detail the steps taken to fix the issue..."
                                            value={explanation}
                                            onChange={(e) => {
                                                setExplanation(e.target.value)
                                                if (errors.explanation) setErrors({...errors, explanation: null})
                                            }}
                                        ></textarea>
                                    </div>
                                    {errors.explanation && <p className="text-error text-xs mt-1 font-medium">{errors.explanation}</p>}
                                </div>

                                {/* Code Fix Section */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 font-headline-sm text-[20px] font-semibold text-on-surface">
                                        <FaCode className="text-primary" />
                                        Code Change
                                    </label>
                                    <div className="rounded-lg overflow-hidden border border-outline-variant transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                                        <div className="bg-surface-container px-4 py-2 flex justify-between items-center border-b border-outline-variant">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1.5 mr-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-warning"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                                                </div>
                                                <span className="font-label-md text-[14px] font-medium text-on-surface-variant">diff_fix</span>
                                            </div>
                                        </div>
                                        <textarea 
                                            className="w-full h-64 bg-surface-container-lowest p-4 font-mono text-[14px] text-on-surface focus:ring-0 border-none outline-none resize-none" 
                                            placeholder="// Paste your code fix here..." 
                                            style={{ lineHeight: 1.6 }}
                                            value={codeChange}
                                            onChange={(e) => setCodeChange(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Environment Details */}
                                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant space-y-6">
                                    <h3 className="font-headline-sm text-[18px] font-semibold text-on-surface flex items-center gap-2 mb-2">
                                        Environment Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Language & Framework */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="font-label-md text-[14px] font-medium text-on-surface-variant block mb-1">
                                                    Language <span className="text-error">*</span>
                                                </label>
                                                <select 
                                                    value={language}
                                                    onChange={(e) => {
                                                        setLanguage(e.target.value);
                                                        setFramework("");
                                                        if (errors.language) setErrors({...errors, language: null})
                                                    }}
                                                    className={`w-full bg-surface-container-lowest border ${errors.language ? 'border-error' : 'border-outline-variant'} rounded-lg px-4 py-2.5 font-body-md text-[16px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface`}
                                                >
                                                    <option value="" disabled>Select language</option>
                                                    {LANGUAGES.map(lang => (
                                                        <option key={lang} value={lang}>{lang}</option>
                                                    ))}
                                                </select>
                                                {errors.language && <p className="text-error text-xs mt-1 font-medium">{errors.language}</p>}
                                            </div>

                                            <div>
                                                <label className="font-label-md text-[14px] font-medium text-on-surface-variant block mb-1">
                                                    Language Version <span className="opacity-70 text-[12px] font-normal">(Optional)</span>
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={languageVersion}
                                                    onChange={(e) => setLanguageVersion(e.target.value)}
                                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[16px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface"
                                                    placeholder="e.g. 17, 3.11"
                                                    maxLength={10}
                                                />
                                            </div>

                                            <div>
                                                <label className="font-label-md text-[14px] font-medium text-on-surface-variant block mb-1">
                                                    Framework <span className="opacity-70 text-[12px] font-normal">(Optional)</span>
                                                </label>
                                                <select 
                                                    value={framework}
                                                    onChange={(e) => setFramework(e.target.value)}
                                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[16px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface"
                                                    disabled={!language || !FRAMEWORKS_BY_LANGUAGE[language]}
                                                >
                                                    <option value="">Select framework</option>
                                                    {language && FRAMEWORKS_BY_LANGUAGE[language]?.map(fw => (
                                                        <option key={fw} value={fw}>{fw}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="font-label-md text-[14px] font-medium text-on-surface-variant block mb-1">
                                                    Framework Version <span className="opacity-70 text-[12px] font-normal">(Optional)</span>
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={frameworkVersion}
                                                    onChange={(e) => setFrameworkVersion(e.target.value)}
                                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[16px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface"
                                                    placeholder="e.g. 3.2.1"
                                                    maxLength={10}
                                                />
                                            </div>
                                        </div>

                                        {/* OS */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="font-label-md text-[14px] font-medium text-on-surface-variant block mb-1">
                                                    OS <span className="opacity-70 text-[12px] font-normal">(Optional)</span>
                                                </label>
                                                <select 
                                                    value={os}
                                                    onChange={(e) => setOs(e.target.value)}
                                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[16px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface"
                                                >
                                                    <option value="">Select OS</option>
                                                    {OS_OPTIONS.map(osOpt => (
                                                        <option key={osOpt} value={osOpt}>{osOpt}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="font-label-md text-[14px] font-medium text-on-surface-variant block mb-1">
                                                    OS Version <span className="opacity-70 text-[12px] font-normal">(Optional)</span>
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={osVersion}
                                                    onChange={(e) => setOsVersion(e.target.value)}
                                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[16px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface"
                                                    placeholder="e.g. 11, 20.04"
                                                    maxLength={10}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant">
                                    <button 
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="w-full sm:w-auto text-on-surface-variant hover:text-on-surface font-body-md text-[16px] transition-colors px-6 py-2"
                                    >
                                        Cancel
                                    </button>
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <button 
                                            type="button"
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-outline-variant text-on-surface px-6 py-2.5 rounded-lg font-body-md text-[16px] hover:bg-surface-container-high transition-colors active:scale-95"
                                        >
                                            <FaEye className="text-[18px]" />
                                            Preview
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={loading || successState}
                                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-body-md text-[16px] font-bold shadow-md transition-all ${
                                                successState 
                                                ? 'bg-primary text-on-primary' 
                                                : 'bg-primary-container text-on-primary-container hover:brightness-105 active:scale-95'
                                            } disabled:opacity-70`}
                                        >
                                            {loading ? (
                                                <><FaSync className="animate-spin" /> Submitting...</>
                                            ) : successState ? (
                                                <><FaCheckCircle /> Success</>
                                            ) : (
                                                operation === "PUT" ? "Save Changes" : "Submit Solution"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Guidance Note */}
                        <div className="flex items-start gap-4 p-4 bg-primary-container border border-primary-container/30 rounded-lg">
                            <FaInfoCircle className="text-primary mt-0.5 text-xl" />
                            <div>
                                <p className="font-label-md text-[14px] text-primary font-bold mb-1 uppercase tracking-wide">Submission Tip</p>
                                <p className="font-body-sm text-[14px] text-on-surface-variant">
                                    High-quality solutions with clear code diffs earn more reputation points and are 3x more likely to be accepted by the reporter.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
