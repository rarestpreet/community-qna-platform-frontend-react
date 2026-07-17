import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import apiCall from "../../services/apiCall"
import { useUserContext } from "../../context/userContext"
import TabLoader from "../../components/ui/TabLoader"
import NavBar from "../../components/NavBar"
import { LANGUAGES, OS_OPTIONS, FRAMEWORKS_BY_LANGUAGE } from "../../util/constants"
import { FaBug, FaExclamationCircle, FaInfoCircle, FaCode, FaTag, FaAlignLeft, FaFolderOpen, FaServer, FaTerminal, FaSpinner, FaPaperPlane } from "react-icons/fa"

export default function AskQuestionPage({ initialBody = "" }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { loading, userProfile, setLoading } = useUserContext()

    const editingQuestion = location.state?.question
    const isEditMode = !!editingQuestion

    const [title, setTitle] = useState(editingQuestion?.title || "")
    const [description, setDescription] = useState(editingQuestion?.description || initialBody)
    const [selectedTagIds, setSelectedTagIds] = useState(editingQuestion?.tags?.map(t => t.tagId) || [])
    
    // Updated Fields (merged framework, os, language versions)
    const [errorType, setErrorType] = useState(editingQuestion?.errorType || "")
    const [language, setLanguage] = useState(editingQuestion?.language || "")
    const [languageVersion, setLanguageVersion] = useState(editingQuestion?.languageVersion || "")
    const [framework, setFramework] = useState(editingQuestion?.framework || "")
    const [frameworkVersion, setFrameworkVersion] = useState(editingQuestion?.frameworkVersion || "")
    const [os, setOs] = useState(editingQuestion?.os || "")
    const [osVersion, setOsVersion] = useState(editingQuestion?.osVersion || "")
    const [reproductionSteps, setReproductionSteps] = useState(editingQuestion?.reproductionSteps || "")
    
    // Project Info
    const [repositoryUrl, setRepositoryUrl] = useState(editingQuestion?.repositoryUrl || "")
    const [branch, setBranch] = useState(editingQuestion?.branch || "")
    const [commitHash, setCommitHash] = useState(editingQuestion?.commitHash || "")
    const [filePath, setFilePath] = useState(editingQuestion?.filePath || "")
    
    // Debug Info
    const [relevantCode, setRelevantCode] = useState(editingQuestion?.relevantCode || "")
    const [relevantLog, setRelevantLog] = useState(editingQuestion?.relevantLog || "")

    const [errors, setErrors] = useState({})
    const [submitError, setSubmitError] = useState("")
    const [availableTags, setAvailableTags] = useState([])
    const [tagsFetched, setTagsFetched] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Redirect if not logged in or is ADMIN
    useEffect(() => {
        if (loading) return
        if (!userProfile?.username) navigate("/login")
        if (userProfile?.roles?.includes("ADMIN")) navigate("/")
    }, [userProfile, navigate, loading])

    // Fetch tags once
    useEffect(() => {
        if (userProfile?.username && !tagsFetched) {
            const fetchTags = async () => {
                try {
                    await apiCall.getAllTags(100, 0, setLoading, setAvailableTags)
                } catch (err) { }
                setTagsFetched(true)
            }
            fetchTags()
        }
    }, [userProfile, tagsFetched, setLoading])

    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <TabLoader rows={3} />
            </div>
        )
    }

    if (!userProfile?.username) return null

    const validate = () => {
        const errs = {}
        if (!title.trim()) errs.title = "Question title is required."
        else if (title.length < 15 || title.length > 100)
            errs.title = "Title must be between 15 and 100 characters."

        if (!description.trim()) errs.description = "Description is required."
        else if (description.length < 50 || description.length > 5000)
            errs.description = "Description must be between 50 and 5000 characters."

        if (!errorType.trim()) errs.errorType = "Error type is required."
        else if (errorType.length > 50) errs.errorType = "Error type must be at most 50 characters."

        if (!language) errs.language = "Language is required."

        if (selectedTagIds.length === 0)
            errs.tags = "At least one tag is required."
        else if (selectedTagIds.length > 5)
            errs.tags = "You can select up to 5 tags."

        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }
        setErrors({})
        setSubmitError("")
        setIsSubmitting(true)

        const payload = {
            title, description, tagIds: selectedTagIds,
            errorType, language, languageVersion, framework, frameworkVersion, os, osVersion,
            reproductionSteps, repositoryUrl, branch, commitHash,
            filePath, relevantCode, relevantLog
        }

        if (isEditMode) {
            const result = await apiCall.updateQuestion(editingQuestion.id, payload, setLoading)
            if (result && typeof result !== "string") {
                setSubmitError(result?.message || "Failed to update question. Please try again.")
                setIsSubmitting(false)
                return
            }
            navigate(-1)
        } else {
            const result = await apiCall.postQuestion(payload, setLoading)
            if (result && typeof result !== "string") {
                setSubmitError(result?.message || "Failed to post question. Please try again.")
                setIsSubmitting(false)
                return
            }
            navigate("/")
        }
    }

    const toggleTag = (tagId) => {
        setSelectedTagIds((prev) => {
            if (prev.includes(tagId)) return prev.filter((id) => id !== tagId)
            if (prev.length >= 5) return prev
            return [...prev, tagId]
        })
    }

    return (
        <div className="min-h-screen bg-surface-container-lowest font-sans selection:bg-primary selection:text-on-primary">
            <NavBar />
            
            <header className="bg-surface border-b border-outline-variant py-8 shadow-sm">
                <div className="max-w-[900px] mx-auto px-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FaBug className="text-primary text-[32px]" />
                        <h1 className="text-display-sm text-on-surface font-bold tracking-tight">
                            {isEditMode ? "Edit Error Report" : "Submit Error Report"}
                        </h1>
                    </div>
                    <p className="text-on-surface-variant text-body-lg max-w-2xl">
                        Help the community understand your issue by providing clear, detailed, and reproducible information.
                    </p>
                </div>
            </header>

            <main className="max-w-[900px] mx-auto px-6 py-8">
                {submitError && (
                    <div className="mb-6 flex items-center gap-2 bg-error/10 border border-error/20 text-error rounded-xl px-4 py-3 text-sm font-medium">
                        <FaExclamationCircle />
                        {submitError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Basic Info */}
                    <section className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 text-primary">
                            <FaInfoCircle />
                            <h2 className="font-headline-md">Basic Information</h2>
                        </div>
                        <div className="space-y-1">
                            <label className="text-label-md text-on-surface">Title <span className="text-error">*</span></label>
                            <input 
                                className={`w-full bg-surface-container-lowest border ${errors.title ? 'border-error' : 'border-outline-variant'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all`} 
                                placeholder="e.g. TypeError: Cannot read properties of undefined (reading 'map')" 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            {errors.title && <p className="text-error text-xs mt-1">{errors.title}</p>}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">Error Type <span className="text-error">*</span></label>
                                <input 
                                    className={`w-full bg-surface-container-lowest border ${errors.errorType ? 'border-error' : 'border-outline-variant'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all`} 
                                    placeholder="e.g. TypeError, NullPointerException" 
                                    type="text"
                                    value={errorType}
                                    onChange={(e) => setErrorType(e.target.value)}
                                />
                                {errors.errorType && <p className="text-error text-xs mt-1">{errors.errorType}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">Primary Language <span className="text-error">*</span></label>
                                <select 
                                    className={`w-full bg-surface-container-lowest border ${errors.language ? 'border-error' : 'border-outline-variant'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all`} 
                                    value={language}
                                    onChange={(e) => {
                                        setLanguage(e.target.value);
                                        setFramework("");
                                    }}
                                >
                                    <option value="" disabled>Select language</option>
                                    {LANGUAGES.map(lang => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                                {errors.language && <p className="text-error text-xs mt-1">{errors.language}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">Language Version</label>
                                <input 
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                                    placeholder="e.g. 17, 3.11"
                                    type="text"
                                    value={languageVersion}
                                    onChange={(e) => setLanguageVersion(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-label-md text-on-surface">Description <span className="text-error">*</span></label>
                                <span className={`text-label-sm ${description.length > 5000 ? 'text-error' : 'text-outline'}`} id="char-counter">{description.length} / 5000</span>
                            </div>
                            {showPreview ? (
                                <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 min-h-[200px] prose prose-sm max-w-none">
                                    {description ? description : <span className="text-outline">No description provided.</span>}
                                </div>
                            ) : (
                                <textarea 
                                    className={`w-full bg-surface-container-lowest border ${errors.description ? 'border-error' : 'border-outline-variant'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-body-md text-on-surface leading-relaxed`}
                                    id="markdown-editor" 
                                    placeholder="Describe what you were trying to do, what happened instead, and any additional context. Markdown is supported." 
                                    rows="8"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            )}
                            {errors.description && <p className="text-error text-xs mt-1">{errors.description}</p>}
                            <div className="flex items-center gap-2 mt-2 text-label-sm text-outline">
                                <FaCode className="text-[16px]" />
                                <span>Markdown formatting is supported</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-label-md text-on-surface">Tags ({selectedTagIds.length}/5) <span className="text-error">*</span></label>
                            <div className="flex flex-wrap gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg min-h-[50px] items-center">
                                {availableTags?.length > 0 ? (
                                    availableTags.map((tag) => {
                                        const isSelected = selectedTagIds.includes(tag.tagId)
                                        return (
                                            <button 
                                                key={tag.tagId}
                                                type="button"
                                                onClick={() => toggleTag(tag.tagId)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm transition-colors border
                                                    ${isSelected 
                                                        ? 'bg-primary text-on-primary border-primary hover:bg-primary/90' 
                                                        : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}
                                            >
                                                <FaTag className="text-[14px]" />
                                                {tag.name}
                                            </button>
                                        )
                                    })
                                ) : (
                                    <span className="text-outline text-sm">No tags available.</span>
                                )}
                            </div>
                            {errors.tags && <p className="text-error text-xs mt-1">{errors.tags}</p>}
                        </div>
                    </section>

                    {/* Reproduction Section */}
                    <section className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 text-primary">
                            <FaAlignLeft />
                            <h2 className="font-headline-md">Reproduction</h2>
                        </div>
                        <div className="space-y-1">
                            <label className="text-label-md text-on-surface">Steps to Reproduce</label>
                            <textarea 
                                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-body-md text-on-surface leading-relaxed" 
                                placeholder="1. Go to '...'\n2. Click on '...'\n3. Scroll down to '...'\n4. See error" 
                                rows="4"
                                value={reproductionSteps}
                                onChange={(e) => setReproductionSteps(e.target.value)}
                            ></textarea>
                        </div>
                    </section>

                    {/* Project Info Section */}
                    <section className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 text-primary">
                            <FaFolderOpen />
                            <h2 className="font-headline-md">Project Info</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">Repository URL</label>
                                <input 
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                                    placeholder="https://github.com/username/repo" 
                                    type="text"
                                    value={repositoryUrl}
                                    onChange={(e) => setRepositoryUrl(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">Branch</label>
                                <input 
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                                    placeholder="e.g. main, feature/auth" 
                                    type="text"
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">Commit Hash</label>
                                <input 
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-mono" 
                                    placeholder="e.g. a1b2c3d" 
                                    type="text"
                                    value={commitHash}
                                    onChange={(e) => setCommitHash(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">File Path</label>
                                <input 
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-mono" 
                                    placeholder="src/components/App.tsx" 
                                    type="text"
                                    value={filePath}
                                    onChange={(e) => setFilePath(e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Environment Section */}
                    <section className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 text-primary">
                            <FaServer />
                            <h2 className="font-headline-md">Environment</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">Framework</label>
                                <select 
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                                    value={framework}
                                    onChange={(e) => setFramework(e.target.value)}
                                    disabled={!language || !FRAMEWORKS_BY_LANGUAGE[language]}
                                >
                                    <option value="">Select framework</option>
                                    {language && FRAMEWORKS_BY_LANGUAGE[language]?.map(fw => (
                                        <option key={fw} value={fw}>{fw}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">Framework Version</label>
                                <input 
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                                    placeholder="e.g. 3.2.1" 
                                    type="text"
                                    value={frameworkVersion}
                                    onChange={(e) => setFrameworkVersion(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">OS / Platform</label>
                                <select 
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                                    value={os}
                                    onChange={(e) => setOs(e.target.value)}
                                >
                                    <option value="">Select OS</option>
                                    {OS_OPTIONS.map(osOpt => (
                                        <option key={osOpt} value={osOpt}>{osOpt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">OS Version</label>
                                <input 
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                                    placeholder="e.g. 11, 20.04" 
                                    type="text"
                                    value={osVersion}
                                    onChange={(e) => setOsVersion(e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Debug Info Section */}
                    <section className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 text-primary">
                            <FaTerminal />
                            <h2 className="font-headline-md">Debug Info</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-label-md text-on-surface">Relevant Code Snippet</label>
                                    <span className="text-label-sm uppercase tracking-wider text-outline px-2 py-0.5 border border-outline-variant rounded bg-surface-container-low">CODE</span>
                                </div>
                                <div className="relative group">
                                    <textarea 
                                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-mono text-sm text-on-surface leading-relaxed whitespace-pre" 
                                        placeholder="// Paste code that triggers the error" 
                                        rows="8"
                                        value={relevantCode}
                                        onChange={(e) => setRelevantCode(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface">Error Logs / Stack Trace</label>
                                <textarea 
                                    className="w-full bg-error/5 border border-error/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-error focus:outline-none transition-all font-mono text-sm text-error whitespace-pre" 
                                    placeholder="Uncaught TypeError: Cannot read properties of undefined..." 
                                    rows="5"
                                    value={relevantLog}
                                    onChange={(e) => setRelevantLog(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
                        <button 
                            className="w-full sm:w-auto px-6 py-2.5 text-on-surface-variant font-label-md hover:text-on-surface transition-colors" 
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            Cancel and Discard
                        </button>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button 
                                className="px-6 py-2.5 bg-surface border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container-low active:scale-95 transition-all" 
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                            >
                                {showPreview ? "Hide Preview" : "Preview Report"}
                            </button>
                            <button 
                                className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <span>{isSubmitting ? "Processing..." : "Submit Report"}</span>
                                {isSubmitting ? (
                                    <FaSpinner className="animate-spin text-[18px]" />
                                ) : (
                                    <FaPaperPlane className="text-[18px]" />
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>

            {/* Footer */}
            <footer className="bg-surface border-t border-outline-variant w-full py-8 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-4">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-label-md font-bold text-on-surface">HearMeOut</span>
                        <p className="text-on-surface-variant text-body-sm mt-1">© 2024 HearMeOut. Built for developers.</p>
                    </div>
                    <div className="flex gap-6">
                        <a className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="#">About</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="#">Terms</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="#">GitHub</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" href="#">Status</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}