import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    ChevronLeft, Mail, Phone, Clock, FileText, 
    Maximize2, X, AlertTriangle 
} from "lucide-react";
import { getApplicationsByJob } from "../services/applicationService";

export default function JobApplicationsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [apps, setApps] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        getApplicationsByJob(id).then(setApps);
    }, [id]);

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-base-100 border border-base-300 rounded-box overflow-hidden shadow-sm relative">
            
            {/* FULL SCREEN PDF MODAL */}
            {selectedPdf && (
                <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
                    <div className="p-4 flex justify-between items-center bg-black/50 border-b border-white/10">
                        <span className="text-white font-black uppercase text-[10px] tracking-widest">Candidate Resume</span>
                        <button onClick={() => setSelectedPdf(null)} className="btn btn-circle btn-sm btn-ghost text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-hidden">
                        <object
                            data={selectedPdf}
                            type="application/pdf"
                            className="w-full h-full rounded-lg"
                        >
                            <div className="flex flex-col items-center justify-center h-full text-white bg-base-300 rounded-lg">
                                <AlertTriangle size={48} className="text-warning mb-4" />
                                <p className="font-bold">PDF Viewer not supported in this browser.</p>
                                <a href={selectedPdf} download className="btn btn-primary mt-4">Download PDF Instead</a>
                            </div>
                        </object>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-base-300 flex items-center gap-4 bg-base-200/30">
                <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm btn-circle"><ChevronLeft size={20} /></button>
                <div>
                    <h2 className="text-sm font-black uppercase tracking-tighter">Candidate Pool</h2>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Applications for #{id}</p>
                </div>
            </div>

            {/* GRID OF CANDIDATES */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {apps.map(app => (
                    <div key={app.id} className="bg-base-100 border border-base-200 rounded-box flex flex-col overflow-hidden group shadow-sm">
                        
                        {/* CV PREVIEW (First Page Embed) */}
                        <div className="h-48 bg-base-300 relative overflow-hidden">
                            <object
                                data={app.cvUrl}
                                type="application/pdf"
                                className="w-full h-full pointer-events-none opacity-50"
                            >
                                <div className="flex items-center justify-center h-full bg-base-300 opacity-20"><FileText size={40}/></div>
                            </object>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <button 
                                    onClick={() => setSelectedPdf(app.cvUrl)}
                                    className="btn btn-xs bg-white text-black border-none hover:bg-white/90 font-black uppercase"
                                >
                                    <Maximize2 size={12} className="mr-1"/> View Full CV
                                </button>
                            </div>
                        </div>

                        {/* CANDIDATE INFO */}
                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="avatar">
                                    <div className="w-12 h-12 rounded-box ring-1 ring-base-300">
                                        <img src={app.pfp} alt={app.name} />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-black truncate">{app.name}</h3>
                                    <p className="text-[10px] font-bold text-primary uppercase">{app.experience} Exp</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-[10px] font-bold">
                                <div className="flex items-center gap-2 opacity-60"><Mail size={12}/> {app.email}</div>
                                <div className="flex items-center gap-2 opacity-60"><Phone size={12}/> {app.phone}</div>
                            </div>

                            <div className="bg-base-200/40 p-3 rounded-btn">
                                <span className="text-[9px] font-black uppercase opacity-40 block mb-1">Candidate Statement</span>
                                <p className="text-[11px] leading-relaxed opacity-80">{app.bio}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}