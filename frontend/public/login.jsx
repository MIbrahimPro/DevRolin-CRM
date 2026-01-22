import { useState, useEffect } from "react";
import { themeChange } from "theme-change";
import { Mail, Lock, User, Palette, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState("login");
    const [loading, setLoading] = useState(false);
    const [currentTheme, setCurrentTheme] = useState("");

    useEffect(() => {
        themeChange(false);

        // Watch for theme changes to swap the logo
        const observer = new MutationObserver(() => {
            const theme = document.documentElement.getAttribute("data-theme");
            setCurrentTheme(theme || "sleepytaco-light");
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        // Set initial theme
        setCurrentTheme(document.documentElement.getAttribute("data-theme") || "sleepytaco-light");

        return () => observer.disconnect();
    }, []);

    // LOGO LOGIC
    // sleepytaco-dark, nord, and retro (darkish) use the light logo
    // sleepytaco-light and cupcake use the dark wordmark
    const getLogo = () => {
        const lightLogos = ["sleepytaco-dark", "nord", "retro"];
        if (lightLogos.includes(currentTheme)) {
            return "./logo.png"; // Light colored wordmark for dark backgrounds
        }
        return "./logo-b.png"; // Dark colored wordmark for light backgrounds
    };

    const handleAuth = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
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
                {/* HEADER AREA WITH LOGO */}
                <div className="text-center space-y-6">
                    <img
                        src={getLogo()}
                        alt="SleepyTaco Logo"
                        className="h-12 mx-auto object-contain transition-opacity duration-300"
                    />
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {activeTab === "login" ? "Welcome back" : "Get started"}
                        </h1>
                        <p className="text-sm text-base-content/60">
                            {activeTab === "login"
                                ? "Please enter your details to sign in."
                                : "Create an account to join SleepyTaco."}
                        </p>
                    </div>
                </div>

                {/* TABS SWITCHER */}
                <div role="tablist" className="tabs tabs-box w-full bg-base-100 border border-base-300 flex">
                    <button
                        role="tab"
                        className={`tab flex-1 transition-all ${activeTab === "login" ? "tab-active font-semibold" : ""}`}
                        onClick={() => setActiveTab("login")}
                    >
                        Sign in
                    </button>
                    <button
                        role="tab"
                        className={`tab flex-1 transition-all ${activeTab === "signup" ? "tab-active font-semibold" : ""}`}
                        onClick={() => setActiveTab("signup")}
                    >
                        Register
                    </button>
                </div>

                {/* MAIN CARD */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-8">
                        <form onSubmit={handleAuth} className="space-y-4">
                            {activeTab === "signup" && (
                                <div className="form-control w-full">
                                    <label className="label pt-0">
                                        <span className="label-text text-xs font-bold opacity-60 uppercase tracking-widest">Full Name</span>
                                    </label>
                                    <label className="input input-bordered w-full bg-base-200/30 flex items-center gap-3">
                                        <User className="size-4 opacity-40" />
                                        <input type="text" className="grow text-sm w-full" placeholder="John Doe" required />
                                    </label>
                                </div>
                            )}

                            <div className="form-control w-full">
                                <label className="label pt-0">
                                    <span className="label-text text-xs font-bold opacity-60 uppercase tracking-widest">Email</span>
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
                                {activeTab === "login" && (
                                    <div className="text-right mt-2">
                                        <a href="/forgot" className="text-xs link link-hover opacity-60 font-medium">Forgot password?</a>
                                    </div>
                                )}
                            </div>

                            <button disabled={loading} className="btn btn-primary w-full mt-2">
                                {loading ? <Loader2 className="size-4 animate-spin" /> : (activeTab === "login" ? "Sign in" : "Create account")}
                            </button>
                        </form>

                        <div className="divider text-[10px] opacity-40 uppercase tracking-widest">Or continue with</div>

                        <button className="btn btn-outline w-full bg-base-100 border-base-300 font-medium hover:bg-base-200">
                            <FcGoogle className="size-5 mr-2" />
                            Continue with Google
                        </button>
                    </div>
                </div>

                {/* FOOTER TEXT */}
                <p className="text-center text-xs text-base-content/40 leading-relaxed">
                    By continuing, you agree to our <br />
                    <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}