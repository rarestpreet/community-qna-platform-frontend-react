import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaTag, FaQuestionCircle, FaLightbulb, FaAlignLeft, FaExclamationCircle, FaCode, FaServer, FaBug } from "react-icons/fa"
import TagPill from "../../components/ui/TagPill"
import apiCall from "../../services/apiCall"
import { useUserContext } from "../../context/userContext"
import TabLoader from "../../components/ui/TabLoader"
import NavBar from "../../components/NavBar"
import { LANGUAGES, OS_OPTIONS, FRAMEWORKS_BY_LANGUAGE } from "../../util/constants"

/* ── Helpers ────────────────────────────────────────────────── */
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

function FieldHint({ icon: Icon, children }) {
    return (
        <div className="flex items-start gap-2 bg-brand-50 border border-brand-100 rounded-xl p-3 text-sm text-brand-800">
            <Icon className="mt-0.5 shrink-0 text-brand-500" />
            <p>{children}</p>
        </div>
    )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function AskQuestionPage({ initialBody = "" }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { loading, userProfile, setLoading } = useUserContext()

    const editingQuestion = location.state?.question
    const isEditMode = !!editingQuestion

    const [title, setTitle] = useState(editingQuestion?.title || "")
    const [description, setDescription] = useState(editingQuestion?.description || initialBody)
    const [selectedTagIds, setSelectedTagIds] = useState(editingQuestion?.tags?.map(t => t.tagId) || [])
    
    // New Fields
    const [errorType, setErrorType] = useState(editingQuestion?.errorType || "")
    const [language, setLanguage] = useState(editingQuestion?.language || "")
    const [languageVersion, setLanguageVersion] = useState(editingQuestion?.languageVersion || "")
    const [framework, setFramework] = useState(editingQuestion?.framework || "")
    const [frameworkVersion, setFrameworkVersion] = useState(editingQuestion?.frameworkVersion || "")
    const [os, setOs] = useState(editingQuestion?.os || "")
    const [osVersion, setOsVersion] = useState(editingQuestion?.osVersion || "")
    const [reproductionSteps, setReproductionSteps] = useState(editingQuestion?.reproductionSteps || "")
    const [repositoryUrl, setRepositoryUrl] = useState(editingQuestion?.repositoryUrl || "")
    const [branch, setBranch] = useState(editingQuestion?.branch || "")
    const [commitHash, setCommitHash] = useState(editingQuestion?.commitHash || "")
    const [filePath, setFilePath] = useState(editingQuestion?.filePath || "")
    const [relevantCode, setRelevantCode] = useState(editingQuestion?.relevantCode || "")
    const [relevantLog, setRelevantLog] = useState(editingQuestion?.relevantLog || "")

    const [errors, setErrors] = useState({})
    const [submitError, setSubmitError] = useState("")
    const [availableTags, setAvailableTags] = useState([])
    const [tagsFetched, setTagsFetched] = useState(false)

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
                await apiCall.getAllTags(setLoading, setAvailableTags)
                setTagsFetched(true)
            }
            fetchTags()
        }
    }, [userProfile, tagsFetched, setLoading])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
            // Scroll to top to show errors
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }
        setErrors({})
        setSubmitError("")

        const payload = {
            title, description, tagIds: selectedTagIds,
            errorType, language, languageVersion, framework, frameworkVersion,
            os, osVersion, reproductionSteps, repositoryUrl, branch, commitHash,
            filePath, relevantCode, relevantLog
        }

        if (isEditMode) {
            const result = await apiCall.updateQuestion(editingQuestion.id, payload, setLoading)
            if (result && typeof result !== "string") {
                setSubmitError(result?.message || "Failed to update question. Please try again.")
                return
            }
            navigate(-1)
        } else {
            const result = await apiCall.postQuestion(payload, setLoading)
            if (result && typeof result !== "string") {
                setSubmitError(result?.message || "Failed to post question. Please try again.")
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
        <div className="min-h-screen bg-gray-50 pb-16">
            <NavBar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    {isEditMode ? "Edit your Error Report" : "Report an Error"}
                </h1>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
                    {/* Basic Info */}
                    <section className="card p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <FaQuestionCircle className="text-brand-500" />
                            <h2 className="font-bold text-gray-800 text-lg">Basic Details</h2>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="question-title" className="text-sm font-semibold text-gray-700">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <CharCounter current={title.length} min={15} max={100} />
                            </div>
                            <input
                                id="question-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. NullPointerException when querying database"
                                className={`input-field ${errors.title ? "input-error" : ""}`}
                                maxLength={100}
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="error-type" className="text-sm font-semibold text-gray-700">
                                    Error Type <span className="text-red-500">*</span>
                                </label>
                            </div>
                            <input
                                id="error-type"
                                type="text"
                                value={errorType}
                                onChange={(e) => setErrorType(e.target.value)}
                                placeholder="e.g. NullPointerException, TypeError"
                                className={`input-field ${errors.errorType ? "input-error" : ""}`}
                                maxLength={50}
                            />
                            {errors.errorType && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.errorType}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="question-desc" className="text-sm font-semibold text-gray-700">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <CharCounter current={description.length} min={50} max={5000} />
                            </div>
                            <textarea
                                id="question-desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide a detailed description of the error..."
                                rows={5}
                                maxLength={5000}
                                className={`input-field resize-none ${errors.description ? "input-error" : ""}`}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="repro-steps" className="text-sm font-semibold text-gray-700">
                                    Reproduction Steps <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                            </div>
                            <textarea
                                id="repro-steps"
                                value={reproductionSteps}
                                onChange={(e) => setReproductionSteps(e.target.value)}
                                placeholder="1. Go to... 2. Click on... 3. See error..."
                                rows={4}
                                className="input-field resize-none"
                            />
                        </div>
                    </section>

                    {/* Environment Info */}
                    <section className="card p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <FaServer className="text-brand-500" />
                            <h2 className="font-bold text-gray-800 text-lg">Environment Info</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">
                                    Language <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    value={language}
                                    onChange={(e) => {
                                        setLanguage(e.target.value);
                                        setFramework(""); // reset framework when language changes
                                    }}
                                    className={`input-field ${errors.language ? "input-error" : ""}`}
                                >
                                    <option value="" disabled>Select language</option>
                                    {LANGUAGES.map(lang => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                                {errors.language && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.language}</p>}
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
                    </section>

                    {/* Code & Logs */}
                    <section className="card p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <FaCode className="text-brand-500" />
                            <h2 className="font-bold text-gray-800 text-lg">Code Context</h2>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-semibold text-gray-700">
                                    Relevant Code <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                            </div>
                            <textarea
                                value={relevantCode}
                                onChange={(e) => setRelevantCode(e.target.value)}
                                placeholder="Paste the code snippet causing the issue..."
                                rows={6}
                                className="input-field resize-none font-mono text-sm"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-semibold text-gray-700">
                                    Relevant Log <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                            </div>
                            <textarea
                                value={relevantLog}
                                onChange={(e) => setRelevantLog(e.target.value)}
                                placeholder="Paste the stack trace or log output..."
                                rows={6}
                                className="input-field resize-none font-mono text-sm bg-gray-50"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">
                                    Repository URL <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={repositoryUrl}
                                    onChange={(e) => setRepositoryUrl(e.target.value)}
                                    placeholder="https://github.com/user/repo"
                                    className="input-field"
                                    maxLength={200}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">
                                    Branch <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}
                                    placeholder="e.g. main, dev"
                                    className="input-field"
                                    maxLength={100}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">
                                    Commit Hash <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={commitHash}
                                    onChange={(e) => setCommitHash(e.target.value)}
                                    placeholder="e.g. 9c1f..."
                                    className="input-field"
                                    maxLength={100}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">
                                    File Path <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={filePath}
                                    onChange={(e) => setFilePath(e.target.value)}
                                    placeholder="e.g. src/main/App.java"
                                    className="input-field"
                                    maxLength={200}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Tags field */}
                    <section className="card p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <FaTag className="text-brand-500" />
                            <h2 className="font-bold text-gray-800 text-lg">Tags</h2>
                        </div>

                        <FieldHint icon={FaLightbulb}>
                            Select 1 to 5 tags to describe what your question is about.
                        </FieldHint>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700 block">
                                Available Tags <span className="text-gray-400 font-normal">({selectedTagIds.length}/5 selected)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableTags?.length > 0 ? (
                                    availableTags.map((tag) => {
                                        const isSelected = selectedTagIds.includes(tag.tagId)
                                        return (
                                            <TagPill
                                                key={tag.tagId}
                                                tag={tag}
                                                variant={isSelected ? "selected" : "default"}
                                                onToggle={() => toggleTag(tag.tagId)}
                                                showTooltip
                                            />
                                        )
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500">No tags available.</p>
                                )}
                            </div>
                        </div>

                        {errors.tags && (
                            <p className="text-red-500 text-xs font-medium">{errors.tags}</p>
                        )}
                    </section>

                    {/* Submit */}
                    <div className="flex flex-col gap-3">
                        {submitError && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium animate-[fadeIn_200ms_ease-out]">
                                <FaExclamationCircle className="shrink-0 text-red-500" />
                                {submitError}
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
                                {loading ? "Saving…" : isEditMode ? "Save Changes" : "Post Your Question"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}