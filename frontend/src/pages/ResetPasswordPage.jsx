import { KeyRound, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResetPasswordPage() {
    return (
        <div className="p-6 max-w-md mx-auto h-full flex flex-col justify-center">
            <Link to="/settings" className="btn btn-link px-0 no-underline text-base-content/50 hover:text-primary gap-2 w-fit mb-6">
                <ArrowLeft size={16} /> Back to settings
            </Link>

            <div className="card bg-base-100 border border-base-300 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold mb-4">Reset Password</h2>

                    <form className="space-y-4">
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text">Old Password</span></label>
                            <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
                            <Link to="/forgot?from=reset" className="text-xs link link-hover text-primary mt-2">
                                Forgot old password?
                            </Link>
                        </div>

                        <div className="form-control w-full">
                            <label className="label"><span className="label-text">New Password</span></label>
                            <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
                        </div>

                        <div className="form-control w-full">
                            <label className="label"><span className="label-text">Confirm New Password</span></label>
                            <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
                        </div>

                        <button className="btn btn-primary w-full mt-4">Save New Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
}