import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import apiCall from '../../services/apiCall';
import { FaPlus, FaTag, FaCheckCircle } from 'react-icons/fa';
import PageNavBar from '../../components/ui/PageNavBar';
import PageLoader from '../../components/ui/PageLoader';

export default function AdminDashboard() {
    const { userProfile } = useUserContext();
    const navigate = useNavigate();

    const [tagsLoading, setTagsLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    // New Tag Form State
    const [tagName, setTagName] = useState("");
    const [tagDescription, setTagDescription] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchTags = async () => {
            const data = await apiCall.getAllTags(setTagsLoading);
            setTags(data);
        };
        fetchTags();
    }, []);

    if (userProfile?.role !== 'ADMIN') return null;

    const validateForm = () => {
        const errs = {};
        if (!tagName.trim()) errs.name = "Tag name is required";
        else if (tagName.length > 15) errs.name = "Tag name must be <15 chars";

        if (!tagDescription.trim()) errs.description = "Description is required";
        else if (tagDescription.length > 50) errs.description = "Description must be <50 chars";

        return errs;
    };

    const handleCreateTag = async (e) => {
        e.preventDefault();
        const errs = validateForm();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setErrors({});
        const response = await apiCall.createNewTag({ name: tagName, description: tagDescription }, setTagsLoading);

        if (response) {
            // Successfully created. Refresh list and reset form
            const updatedTags = await apiCall.getAllTags(setTagsLoading);
            setTags(updatedTags);
            setTagName("");
            setTagDescription("");
            setShowAddForm(false);
        }
    };

    return (
        <>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

                {/* Header */}
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <FaTag className="text-2xl text-brand-500" />
                        <h1 className="text-2xl font-bold text-slate-800">Tag Management</h1>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn-primary"
                    >
                        <FaPlus /> New Tag
                    </button>
                </div>

                {/* Add Tag Form */}
                {showAddForm && (
                    <div className="glass-panel p-6 sm:p-8 animate-fade-in-down">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Create a New Tag</h2>
                        <form onSubmit={handleCreateTag} className="flex flex-col gap-5">

                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1 block">Tag Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={tagName}
                                    onChange={(e) => setTagName(e.target.value)}
                                    maxLength={15}
                                    placeholder="e.g. React"
                                    className={`w-full border ${errors.name ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:ring-brand-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-4 transition`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1 block">Description <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={tagDescription}
                                    onChange={(e) => setTagDescription(e.target.value)}
                                    maxLength={50}
                                    placeholder="Brief info about the tag"
                                    className={`w-full border ${errors.description ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:ring-brand-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-4 transition`}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description}</p>}
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Save Tag
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tags List */}
                <div className="glass-panel overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">ID</th>
                                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Tag Name</th>
                                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tagsLoading ? (
                                <tr>
                                    <td colSpan="3" className="py-10">
                                        <PageLoader text="Loading tags..." />
                                    </td>
                                </tr>
                            ) : tags.length > 0 ? (
                                tags.map(tag => (
                                    <tr key={tag.tagId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-slate-500">#{tag.tagId}</td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-semibold text-xs border border-slate-200 uppercase tracking-wider">{tag.name}</span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600">{tag.description}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-10 text-center text-slate-500">
                                        No tags found. Create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
}
