import { KeyRound, Palette, Bell, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function SettingsPage() {
    const handleThemeChange = (themeName) => {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>

            <div className="grid grid-cols-1 gap-4">
                {/* Security Section */}
                <div className="card bg-base-100 border border-base-300">
                    <div className="card-body">
                        <h3 className="font-bold flex items-center gap-2 mb-4"><Shield size={18} /> Security</h3>
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <p className="font-semibold">Password</p>
                                <p className="text-xs opacity-50">Change your login credentials</p>
                            </div>
                            <Link to="/settings/reset-password" title="reset" className="btn btn-sm">Update Password</Link>
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="card bg-base-100 border border-base-300">
                    <div className="card-body">
                        <h3 className="font-bold flex items-center gap-2 mb-4"><Palette size={18} /> Appearance</h3>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">Change Theme</p>

                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm opacity-50 hover:opacity-100">
                                    <Palette className="size-4 mr-2" />
                                    Theme
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 z-50">
                                    <li><button onClick={() => handleThemeChange('sleepytaco-light')}>Sleepy Light</button></li>
                                    <li><button onClick={() => handleThemeChange('sleepytaco-dark')}>Sleepy Dark</button></li>
                                    <li><button onClick={() => handleThemeChange('cupcake')}>Cupcake</button></li>
                                    <li><button onClick={() => handleThemeChange('retro')}>Retro</button></li>
                                    <li><button onClick={() => handleThemeChange('nord')}>Nord</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}