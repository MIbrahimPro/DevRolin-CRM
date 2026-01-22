import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users, MoreVertical, MessageSquare,
    UserPlus, ShieldAlert, Phone, Briefcase, ChevronRight
} from "lucide-react";
import { getAllEmployees } from "../services/userService";

export default function EmployeeManagementPage() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await getAllEmployees();
                setEmployees(data);
            } catch (error) {
                console.error("Error loading employees:", error);
            } finally {
                setLoading(false);
            }
        };
        loadEmployees();
    }, []);

    // Grouping logic
    const roles = [...new Set(employees.map(emp => emp.role))];

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-base-100 border border-base-300 rounded-box overflow-hidden shadow-sm">

            {/* UNIFIED HEADER */}
            <div className="px-6 py-5 border-b border-base-300 flex items-center justify-between bg-base-200/30">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-box text-primary">
                        <Users size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black leading-none uppercase tracking-tighter">Directory</h2>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Personnel Management</p>
                    </div>
                </div>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle opacity-40 hover:opacity-100">
                        <MoreVertical size={20} />
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-56 border border-base-300 z-50">
                        <div className="px-4 py-2 mb-1 border-b border-base-200">
                            <p className="text-[9px] font-black uppercase opacity-30 tracking-widest">Administrative</p>
                        </div>
                        <li>
                            <button onClick={() => navigate('/employees/unverified')} className="flex items-center gap-3 py-3">
                                <ShieldAlert size={16} className="text-warning" />
                                <span className="font-bold text-xs uppercase tracking-tight">Unverified Staff</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/new-job')} className="flex items-center gap-3 py-3">
                                <UserPlus size={16} className="text-primary" />
                                <span className="font-bold text-xs uppercase tracking-tight">Create New Job</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* SCROLLABLE LIST */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <div className="p-6 space-y-12">
                        {roles.map(role => (
                            <div key={role} className="space-y-4">
                                <div className="divider before:bg-base-300/50 after:bg-base-300/50">
                                    <div className="flex items-center gap-2 opacity-30">
                                        <Briefcase size={12} strokeWidth={3} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{role}s</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {employees.filter(emp => emp.role === role).map(employee => (
                                        <div
                                            key={employee.id}
                                            className="group bg-base-100 border border-base-200 rounded-box p-4 hover:border-primary/40 transition-all flex items-center justify-between"
                                        >
                                            <div
                                                className="flex items-center gap-4 cursor-pointer flex-1"
                                                onClick={() => navigate(`/employees/${employee.id}`)}
                                            >
                                                <div className={`avatar ${employee.isVerified ? 'online' : ''}`}>
                                                    <div className="w-12 h-12 rounded-box ring-1 ring-base-300">
                                                        <img src={employee.avatar} alt={employee.name} />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-sm font-black truncate">{employee.name}</h3>
                                                        {!employee.isVerified && <span className="badge badge-warning badge-xs opacity-50"></span>}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5 opacity-40">
                                                        <Phone size={10} />
                                                        <p className="text-[10px] font-bold">{employee.whatsapp}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/chat/${employee.id}`);
                                                    }}
                                                    className="btn btn-ghost btn-sm btn-circle text-primary opacity-20 group-hover:opacity-100 group-hover:bg-primary/5 transition-all"
                                                >
                                                    <MessageSquare size={18} />
                                                </button>
                                                <ChevronRight size={14} className="opacity-10 group-hover:opacity-30" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}