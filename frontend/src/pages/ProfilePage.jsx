import { useState, useEffect } from "react";
import {
    Edit3, Check, X, Phone, User, Mail, Wallet,
    ShieldCheck, Camera, Briefcase, UserCircle
} from "lucide-react";
import ImageModal from "../components/ImageModal";
import { getCurrentUser, updateUserProfile } from "../services/userService";

export default function ProfilePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [profile, setProfile] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await getCurrentUser();
                setProfile(userData);
            } catch (error) {
                console.error("Error loading user data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, []);

    const startEditing = (field) => {
        setEditing(field);
        setTempValue(profile[field]);
    };

    const save = async (field) => {
        try {
            await updateUserProfile(field, tempValue);
            setProfile({ ...profile, [field]: tempValue });
            setEditing(null);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-base-100 border border-base-300 rounded-box overflow-hidden shadow-sm animate-in fade-in duration-500">

            {/* MATCHING HEADER STYLE */}
            <div className="px-6 py-5 border-b border-base-300 flex items-center justify-between bg-base-200/30">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-box text-primary">
                        <UserCircle size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black leading-none uppercase tracking-tighter">User Profile</h2>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Personal Settings</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="badge badge-success font-black text-[9px] py-3 uppercase text-white border-none">Verified</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="loading loading-spinner loading-lg text-primary"></div>
                    </div>
                ) : profile ? (
                    <div className="p-8 lg:p-12 space-y-12">

                        {/* PROFILE HERO SECTION */}
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-4">
                            <div className="relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
                                <div className="avatar">
                                    <div className="w-28 h-28 rounded-box ring-4 ring-primary/10 ring-offset-base-100 ring-offset-2">
                                        <img src={profile.avatar} alt="pfp" className="object-cover" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-box opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                                    <Camera className="text-white size-6" />
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-black tracking-tighter">{profile.name}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                    <Briefcase size={14} className="text-primary" />
                                    <p className="text-[11px] font-black opacity-50 uppercase tracking-[0.15em]">{profile.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 1: IDENTITY */}
                        <section>
                            <div className="divider before:bg-base-300/50 after:bg-base-300/50 mb-10">
                                <div className="flex items-center gap-2 opacity-30">
                                    <User size={12} strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Identity details</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                                <InfoField
                                    label="Legal Name"
                                    value={profile.name}
                                    icon={<User size={16} />}
                                    editing={editing === 'name'}
                                    tempValue={tempValue}
                                    setTemp={setTempValue}
                                    onEdit={() => startEditing('name')}
                                    onSave={() => save('name')}
                                    onCancel={() => setEditing(null)}
                                />
                                <InfoField
                                    label="WhatsApp Contact"
                                    value={profile.whatsapp}
                                    icon={<Phone size={16} />}
                                    editing={editing === 'whatsapp'}
                                    tempValue={tempValue}
                                    setTemp={setTempValue}
                                    onEdit={() => startEditing('whatsapp')}
                                    onSave={() => save('whatsapp')}
                                    onCancel={() => setEditing(null)}
                                />
                            </div>
                        </section>

                        {/* SECTION 2: WORK */}
                        <section>
                            <div className="divider before:bg-base-300/50 after:bg-base-300/50 mb-10">
                                <div className="flex items-center gap-2 opacity-30">
                                    <Briefcase size={12} strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Work & Finance</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                                <ReadOnlyField label="Primary Email" value={profile.email} icon={<Mail size={16} />} />
                                <ReadOnlyField label="Current Salary" value={profile.salary} icon={<Wallet size={16} />} />
                            </div>
                        </section>

                        {/* FOOTER NOTICE */}
                        <div className="p-5 rounded-box bg-base-200/50 border border-base-300 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <ShieldCheck size={20} className="text-primary opacity-80" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Security Protocols</p>
                                    <p className="text-[9px] font-bold opacity-40 uppercase mt-0.5">Internal Employee Verification Active</p>
                                </div>
                            </div>
                            <span className="text-[9px] font-bold opacity-20 uppercase tracking-tighter">System ID: {profile.id?.slice(-8) || "88392-X"}</span>
                        </div>

                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Profile not found</p>
                    </div>
                )}
            </div>

            <ImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} imageUrl={profile?.avatar} />
        </div>
    );
}

function InfoField({ label, value, icon, editing, tempValue, setTemp, onEdit, onSave, onCancel }) {
    return (
        <div className="group">
            <p className="text-[10px] font-black uppercase tracking-[0.1em] opacity-30 mb-3">{label}</p>
            <div className={`flex items-center gap-4 min-h-[44px] border-b transition-all ${editing ? 'border-primary' : 'border-base-300 group-hover:border-base-content/20'}`}>
                <div className={`${editing ? 'text-primary' : 'opacity-20'}`}>{icon}</div>

                {editing ? (
                    <div className="flex-1 flex items-center gap-2">
                        <input
                            className="bg-transparent border-none outline-none w-full font-bold text-sm text-base-content"
                            value={tempValue}
                            onChange={e => setTemp(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-1">
                            <button onClick={onSave} className="btn btn-ghost btn-xs text-success hover:bg-success/10"><Check size={16} /></button>
                            <button onClick={onCancel} className="btn btn-ghost btn-xs text-error hover:bg-error/10"><X size={16} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-bold tracking-tight">{value}</span>
                        <button onClick={onEdit} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit3 size={14} className="opacity-40 hover:opacity-100 hover:text-primary" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ReadOnlyField({ label, value, icon }) {
    return (
        <div className="opacity-60">
            <p className="text-[10px] font-black uppercase tracking-[0.1em] opacity-40 mb-3">{label}</p>
            <div className="flex items-center gap-4 min-h-[44px] border-b border-transparent">
                <div className="opacity-30">{icon}</div>
                <span className="text-sm font-bold tracking-tight">{value}</span>
            </div>
        </div>
    );
}