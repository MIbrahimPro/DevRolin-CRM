import { useState, useEffect } from "react";
import { themeChange } from "theme-change";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Palette, Loader2, ChevronLeft, MoreVertical } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
    const [loading, setLoading] = useState(false);
    const [currentTheme, setCurrentTheme] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        themeChange(false);
        const observer = new MutationObserver(() => {
            const theme = document.documentElement.getAttribute("data-theme");
            setCurrentTheme(theme || "sleepytaco-light");
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        setCurrentTheme(document.documentElement.getAttribute("data-theme") || "sleepytaco-light");
        return () => observer.disconnect();
    }, []);

    const getLogo = () => {
        const lightLogos = ["sleepytaco-dark", "nord", "retro"];
        return lightLogos.includes(currentTheme) ? "./logo.png" : "./logo-b.png";
    };

    const handleAuth = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login logic
        setTimeout(() => {
            setLoading(false);
            navigate("/profile");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6 transition-colors duration-300">

            {/* THEME PICKER */}
            <div className="absolute top-6 right-6 dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm opacity-50 hover:opacity-100">
                    <Palette className="size-4 mr-2" />
                    Theme
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 z-50">
                    <li><button data-set-theme="sleepytaco-light">Sleepy Light</button></li>
                    <li><button data-set-theme="sleepytaco-dark">Sleepy Dark</button></li>
                    <li><button data-set-theme="cupcake">Cupcake</button></li>
                    <li><button data-set-theme="retro">Retro</button></li>
                    <li><button data-set-theme="nord">Nord</button></li>
                </ul>
            </div>

            <div className="w-full max-w-[440px] space-y-6">
                {/* LOGO AREA */}
                <div className="text-center">
                    <img
                        src={getLogo()}
                        alt="SleepyTaco Logo"
                        className="h-10 mx-auto object-contain transition-opacity duration-300 mb-2"
                    />
                </div>

                {/* MAIN CARD */}
                <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">

                    {/* NEW HEADER SECTION (Matching Chat Style) */}
                    <div className="px-6 py-4 border-b border-base-300 flex items-center justify-between bg-base-200/30">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-box">
                                    <Lock size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black leading-none uppercase tracking-tight">Welcome back</h2>
                                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">
                                        Secure Portal Access
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* <button className="btn btn-ghost btn-sm btn-circle opacity-40">
                            <MoreVertical size={18} />
                        </button> */}
                    </div>

                    <div className="card-body p-8 pt-6">
                        <form onSubmit={handleAuth} className="space-y-4">
                            <div className="form-control w-full">
                                <label className="label pt-0">
                                    <span className="label-text text-xs font-bold opacity-60 uppercase tracking-widest">Email Address</span>
                                </label>
                                <label className="input input-bordered w-full bg-base-200/30 flex items-center gap-3">
                                    <Mail className="size-4 opacity-40" />
                                    <input type="email" className="grow text-sm w-full" placeholder="name@company.com" required />
                                </label>
                            </div>

                            <div className="form-control w-full">
                                <label className="label pt-0">
                                    <span className="label-text text-xs font-bold opacity-60 uppercase tracking-widest">Password</span>
                                </label>
                                <label className="input input-bordered w-full bg-base-200/30 flex items-center gap-3">
                                    <Lock className="size-4 opacity-40" />
                                    <input type="password" placeholder="••••••••" className="grow text-sm w-full" required />
                                </label>
                                <div className="text-right mt-2">
                                    <a href="/forgot" className="text-xs link link-hover opacity-60 font-medium">Forgot password?</a>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="btn btn-primary w-full mt-2 font-black uppercase tracking-widest text-[11px]"
                            >
                                {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in to Account"}
                            </button>
                        </form>

                        <div className="divider text-[10px] opacity-40 uppercase tracking-widest my-6">Or continue with</div>

                        <button className="btn btn-outline w-full bg-base-100 border-base-300 font-bold text-xs uppercase hover:bg-base-200">
                            <FcGoogle className="size-5 mr-2" />
                            Google
                        </button>
                    </div>
                </div>

                {/* FOOTER TEXT */}
                <p className="text-center text-xs text-base-content/40 leading-relaxed">
                    Access restricted to authorized personnel. <br />
                    Contact admin for <a href="#" className="underline hover:text-primary transition-colors">Access Requests</a>.
                </p>
            </div>
        </div>
    );
}