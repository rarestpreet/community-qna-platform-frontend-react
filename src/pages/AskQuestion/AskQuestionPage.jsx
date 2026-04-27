import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaTag, FaCheckCircle, FaQuestionCircle, FaLightbulb, FaAlignLeft } from "react-icons/fa"
import TagPill from "../../components/ui/TagPill"
import apiCall from "../../services/apiCall"
import { useUserContext } from "../../context/userContext"
import TabLoader from "../../components/ui/TabLoader"
import NavBar from "../../components/NavBar"

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
    const [body, setBody] = useState(editingQuestion?.body || initialBody)
    const [selectedTagIds, setSelectedTagIds] = useState(editingQuestion?.tags?.map(t => t.tagId) || [])
    const [errors, setErrors] = useState({})
    const [availableTags, setAvailableTags] = useState([])
    const [tagsFetched, setTagsFetched] = useState(false)

    // Redirect if not logged in
    useEffect(() => {
        if (loading) return
        if (!userProfile?.username) navigate("/login")
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
        else if (title.length < 15 || title.length > 150)
            errs.title = "Title must be between 15 and 150 characters."

        if (!body.trim()) errs.body = "Description is required."
        else if (body.length < 50 || body.length > 500)
            errs.body = "Description must be between 50 and 500 characters."

        if (selectedTagIds.length === 0)
            errs.tags = "At least one tag is required."
        else if (selectedTagIds.length > 10)
            errs.tags = "You can select up to 10 tags."

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
        
        if (isEditMode) {
            await apiCall.updateQuestion(editingQuestion.postId, { title, body, tagIds: selectedTagIds }, setLoading)
            navigate(-1)
        } else {
            await apiCall.postQuestion({ title, body, tagIds: selectedTagIds }, setLoading)
            navigate("/")
        }
        
        setSelectedTagIds([])
        setBody("")
        setTitle("")
    }

    const toggleTag = (tagId) => {
        setSelectedTagIds((prev) => {
            if (prev.includes(tagId)) return prev.filter((id) => id !== tagId)
            if (prev.length >= 10) return prev
            return [...prev, tagId]
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
                    {/* Title field */}
                    <section className="card p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <FaQuestionCircle className="text-brand-500" />
                            <h2 className="font-bold text-gray-800 text-lg">
                                {isEditMode ? "Edit Question Title" : "Question Title"}
                            </h2>
                        </div>

                        <FieldHint icon={FaLightbulb}>
                            Be specific and imagine you're asking another person. A good title
                            summarises the problem in a single sentence.
                        </FieldHint>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="question-title" className="text-sm font-semibold text-gray-700">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <CharCounter current={title.length} min={15} max={150} />
                            </div>
                            <input
                                id="question-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. How do I center a div vertically in CSS?"
                                className={`input-field ${errors.title ? "input-error" : ""}`}
                                maxLength={150}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title}</p>
                            )}
                        </div>
                    </section>

                    {/* Body field */}
                    <section className="card p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <FaAlignLeft className="text-brand-500" />
                            <h2 className="font-bold text-gray-800 text-lg">Question Details</h2>
                        </div>

                        <FieldHint icon={FaLightbulb}>
                            Include all information someone would need to answer your question —
                            what you've tried, what you expected, and what happened instead.
                        </FieldHint>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="question-body" className="text-sm font-semibold text-gray-700">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <CharCounter current={body.length} min={50} max={500} />
                            </div>
                            <textarea
                                id="question-body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Describe your problem in detail. What have you tried so far?"
                                rows={7}
                                maxLength={500}
                                className={`input-field resize-none ${errors.body ? "input-error" : ""}`}
                            />
                            {errors.body && (
                                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.body}</p>
                            )}
                        </div>
                    </section>

                    {/* Tags field */}
                    <section className="card p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <FaTag className="text-brand-500" />
                            <h2 className="font-bold text-gray-800 text-lg">Tags</h2>
                        </div>

                        <FieldHint icon={FaLightbulb}>
                            Select up to 10 tags to describe what your question is about.
                        </FieldHint>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700 block">
                                Available Tags <span className="text-gray-400 font-normal">({selectedTagIds.length}/10 selected)</span>
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
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {isEditMode ? "Save Changes" : "Post Your Question"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}