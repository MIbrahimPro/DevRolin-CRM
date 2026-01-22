import { useState } from "react";
import { Mail, ArrowLeft, ShieldCheck, Loader2, ChevronLeft } from "lucide-react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export default function ForgotPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const backUrl = searchParams.get("from") === "reset" ? "/settings/reset-password" : "/login";
    const [emailSent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setEmailSent(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6 transition-colors duration-300">
            <div className="w-full max-w-[440px] space-y-6">

                <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
                    {/* HEADER SECTION - Matching Style */}
                    <div className="px-6 py-4 border-b border-base-300 flex items-center justify-between bg-base-200/30">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(backUrl)} className="btn btn-ghost btn-sm btn-circle">
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-box">
                                    <ShieldCheck size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black leading-none uppercase tracking-tight">Security</h2>
                                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">
                                        Password Recovery
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-body p-8">
                        {!emailSent ? (
                            <>
                                <div className="mb-6 text-center sm:text-left">
                                    <h1 className="text-xl font-bold">Reset Password</h1>
                                    <p className="text-sm text-base-content/60 mt-1">
                                        Enter your email to receive a recovery link.
                                    </p>
                                </div>

                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div className="form-control w-full">
                                        <label className="label pt-0">
                                            <span className="label-text font-bold text-xs opacity-60 uppercase tracking-widest">Email Address</span>
                                        </label>
                                        <label className="input w-full input-bordered bg-base-200/30 flex items-center gap-3">
                                            <Mail className="size-4 opacity-40" />
                                            <input type="email" className="grow text-sm" placeholder="name@company.com" required />
                                        </label>
                                    </div>

                                    <button
                                        disabled={loading}
                                        className="btn btn-primary w-full font-black uppercase tracking-widest text-[11px]"
                                    >
                                        {loading ? <Loader2 className="size-4 animate-spin" /> : "Send Reset Link"}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
                                <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                                    <Mail className="size-8 text-success" />
                                </div>
                                <h2 className="text-2xl font-bold">Check your inbox</h2>
                                <p className="text-sm text-base-content/60 mt-3 leading-relaxed">
                                    A recovery link has been sent to your email address.
                                </p>
                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="btn btn-ghost btn-sm mt-8 opacity-60 hover:opacity-100 font-bold uppercase text-[10px] tracking-widest"
                                >
                                    Resend email
                                </button>
                            </div>
                        )}
                    </div>

                    {/* FOOTER ACTION */}
                    {/* <div className="border-t border-base-300 bg-base-200/30 p-4 flex justify-center">
                        <Link to="/login" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                            <ArrowLeft className="size-3" />
                            Return to Login
                        </Link>
                    </div> */}
                </div>
            </div>
        </div>
    );
}