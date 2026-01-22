import { useState, useEffect } from "react";
import {
    Briefcase, Link, Edit3, Check, X,
    ClipboardCheck, AlertCircle, Search
} from "lucide-react";
import { getAllJobs, updateJobDetails } from "../services/jobService";

export default function HRJobBoard() {
    const [jobs, setJobs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ description: "", requirements: "" });
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        const data = await getAllJobs();
        setJobs(data);
    };

    const handleCopy = (id) => {
        const inviteUrl = `${window.location.origin}/apply/${id}`;
        navigator.clipboard.writeText(inviteUrl);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const startEdit = (job) => {
        setEditingId(job.id);
        setEditForm({ description: job.description, requirements: job.requirements });
    };

    const saveEdit = async (id) => {
        await updateJobDetails(id, editForm);
        setEditingId(null);
        loadJobs();
    };

    const handleCardClick = (e, jobId) => {
        if (editingId || e.target.closest('button') || e.target.closest('textarea')) return;
        navigate(`/new-job-man/${jobId}`);
    };

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-base-100 border border-base-300 rounded-box overflow-hidden shadow-sm">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-base-300 flex items-center justify-between bg-base-200/30">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-secondary/10 rounded-box text-secondary">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black leading-none uppercase tracking-tighter">Job Requisitions</h2>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">HR Administration Board</p>
                    </div>
                </div>
            </div>

            {/* JOB LIST */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        onClick={(e) => handleCardClick(e, job.id)}
                        className={`group bg-base-100 border border-base-200 rounded-box overflow-hidden transition-all hover:border-secondary shadow-sm ${!editingId ? 'cursor-pointer' : ''}`}
                    >
                        <div className="p-5 border-b border-base-200/50 bg-base-200/10 flex flex-wrap items-center justify-between gap-4">        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase opacity-30 tracking-widest leading-none mb-1">Position</span>
                            <h3 className="text-sm font-black uppercase">{job.title}</h3>
                        </div>
                            <div className="flex gap-8">
                                <div>
                                    <span className="text-[10px] font-black uppercase opacity-30 tracking-widest block mb-1">Salary</span>
                                    <span className="text-xs font-bold">{job.salary}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase opacity-30 tracking-widest block mb-1">Exp</span>
                                    <span className="text-xs font-bold">{job.minExp}</span>
                                </div>
                            </div>

                            {/* ACTIONS: Always visible on mobile, hover on desktop */}

                            <div className="flex items-center gap-2 lg:opacity-100 transition-opacity ml-auto">
                                <button
                                    onClick={() => handleCopy(job.id)}
                                    className={`btn btn-xs sm:btn-sm border-none font-black text-[10px] uppercase transition-all
        ${copiedId === job.id
                                            ? 'btn-success text-success-content'
                                            : 'bg-base-300 text-base-content hover:bg-primary hover:text-primary-content'
                                        }`}
                                >
                                    {copiedId === job.id ? <ClipboardCheck size={14} /> : <Link size={14} />}
                                    {copiedId === job.id ? 'Copied' : 'Invite'}
                                </button>
                                {editingId !== job.id && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); startEdit(job); }}
                                        className="btn btn-xs sm:btn-sm bg-secondary text-secondary-content hover:bg-secondary/80 border-none font-black text-[10px] uppercase"
                                    >
                                        <Edit3 size={14} /> Edit
                                    </button>
                                )}
                            </div>

                        </div>

                        {/* EDITABLE BOTTOM SECTION */}
                        <div className="p-5 space-y-6 bg-base-100">
                            {editingId === job.id ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="form-control w-full">
                                        <label className="mb-2 block"><span className="text-[10px] font-black uppercase opacity-50">Job Description</span></label>
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            className="textarea textarea-bordered w-full text-sm font-medium bg-base-200/20"
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="mb-2 block"><span className="text-[10px] font-black uppercase opacity-50">Key Requirements / Skills</span></label>
                                        <textarea
                                            value={editForm.requirements}
                                            onChange={(e) => setEditForm({ ...editForm, requirements: e.target.value })}
                                            className="textarea textarea-bordered w-full text-sm font-medium bg-base-200/20"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingId(null)} className="btn btn-sm btn-ghost font-black text-[10px] uppercase">Cancel</button>
                                        <button onClick={() => saveEdit(job.id)} className="btn btn-sm btn-secondary font-black text-[10px] uppercase">Save Changes</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <span className="text-[10px] font-black uppercase opacity-30 tracking-widest block mb-2">Description</span>
                                        <p className="text-xs font-medium leading-relaxed opacity-70">{job.description}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase opacity-30 tracking-widest block mb-2">Requirements</span>
                                        <p className="text-xs font-medium leading-relaxed opacity-70">{job.requirements}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}