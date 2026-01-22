import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeft, Briefcase, Send,
    Layers, Clock, DollarSign, Award, X, AlertCircle
} from "lucide-react";

export default function NewJobPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState({ active: false, type: null });

    const [formData, setFormData] = useState({
        title: "",
        minExp: "",
        position: "",
        salary: "",
        description: "",
        requirements: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Confirmation Logic
    const triggerConfirm = (type) => setShowConfirm({ active: true, type });
    const closeConfirm = () => setShowConfirm({ active: false, type: null });

    const handleAction = () => {
        if (showConfirm.type === 'send') {
            setLoading(true);
            setShowConfirm({ active: false, type: null });
            setTimeout(() => {
                console.log("Submitted:", formData);
                navigate('/employee-manage');
            }, 1500);
        } else {
            // Cancel or Back
            navigate('/employee-manage');
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-base-100 border border-base-300 rounded-box overflow-hidden shadow-sm relative">

            {/* OVERLAY CONFIRMATION MODAL */}
            {showConfirm.active && (
                <div className="absolute inset-0 z-[100] bg-base-300/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-base-100 border border-base-300 p-8 rounded-box shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className={`p-3 rounded-full ${showConfirm.type === 'send' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                                <AlertCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-tight">
                                    {showConfirm.type === 'send' ? 'Confirm Submission' : 'Discard Changes?'}
                                </h3>
                                <p className="text-xs font-bold opacity-50 mt-2">
                                    {showConfirm.type === 'send'
                                        ? 'This will send the job requisition to the HR department for approval.'
                                        : 'Are you sure? Any information you entered will be permanently lost.'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 w-full mt-4">
                                <button onClick={closeConfirm} className="btn btn-ghost btn-sm font-black text-[10px] uppercase">Wait, No</button>
                                <button onClick={handleAction} className={`btn btn-sm font-black text-[10px] uppercase ${showConfirm.type === 'send' ? 'btn-primary' : 'btn-error'}`}>
                                    Yes, Proceed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-base-300 flex items-center justify-between bg-base-200/30">
                <div className="flex items-center gap-4">
                    <button onClick={() => triggerConfirm('back')} className="btn btn-ghost btn-sm btn-circle">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-sm font-black leading-none uppercase tracking-tighter">Create New Job</h2>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">HR Requisition Form</p>
                    </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-box text-primary">
                    <Briefcase size={20} />
                </div>
            </div>

            {/* FORM AREA */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                <form className="space-y-10">

                    {/* BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="form-control w-full">
                            <label className="mb-2"><span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Job Title</span></label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Developer" className="input input-bordered w-full font-bold text-sm bg-base-200/20" />
                        </div>
                        <div className="form-control w-full">
                            <label className="mb-2"><span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Position Level</span></label>
                            <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="e.g. Manager" className="input input-bordered w-full font-bold text-sm bg-base-200/20" />
                        </div>
                        <div className="form-control w-full">
                            <label className="mb-2"><span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Min. Experience</span></label>
                            <input type="text" name="minExp" value={formData.minExp} onChange={handleChange} placeholder="e.g. 3-5 Years" className="input input-bordered w-full font-bold text-sm bg-base-200/20" />
                        </div>
                        <div className="form-control w-full">
                            <label className="mb-2"><span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Expect Salary</span></label>
                            <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. $5,000 - $7,000" className="input input-bordered w-full font-bold text-sm bg-base-200/20" />
                        </div>
                    </div>

                    {/* FULL WIDTH SECTION */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 whitespace-nowrap">Job Specification</span>
                            <div className="h-px w-full bg-base-300/50"></div>
                        </div>

                        <div className="form-control w-full">
                            <label className="mb-2"><span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Job Description</span></label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe the core purpose of this role..." className="textarea textarea-bordered w-full font-medium text-sm bg-base-200/20" />
                        </div>

                        <div className="form-control w-full">
                            <label className="mb-2"><span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Key Requirements / Skills</span></label>
                            <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="4" placeholder="List required skills (React, Figma, Leadership...)" className="textarea textarea-bordered w-full font-medium text-sm bg-base-200/20" />
                        </div>
                    </div>

                    {/* BUTTONS RIGHT ALIGNED */}
                    <div className="flex justify-end items-center gap-3 pt-6 border-t border-base-300/50">
                        <button
                            type="button"
                            onClick={() => triggerConfirm('cancel')}
                            className="btn btn-ghost px-6 font-black text-[11px] uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerConfirm('send')}
                            disabled={loading}
                            className="btn btn-primary px-8 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                            {loading ? <span className="loading loading-spinner loading-xs"></span> : (
                                <>
                                    Send Request to HR
                                    <Send size={14} className="ml-2" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}