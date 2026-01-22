import { X, Upload, Trash2 } from "lucide-react";

export default function ImageModal({ isOpen, onClose, imageUrl, allowEdit = false }) {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box p-0 overflow-hidden bg-transparent shadow-none border-none max-w-2xl">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white z-10"
                >
                    <X />
                </button>

                <div className="flex flex-col items-center gap-4">
                    <img
                        src={imageUrl}
                        className="w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                        alt="Profile Preview"
                    />

                    {allowEdit && (
                        <div className="flex gap-2 p-4 bg-base-100 rounded-2xl border border-base-300 shadow-xl">
                            <label className="btn btn-primary btn-sm">
                                <Upload className="size-4 mr-2" />
                                Change
                                <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" />
                            </label>
                            <button className="btn btn-error btn-outline btn-sm">
                                <Trash2 className="size-4 mr-2" />
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="modal-backdrop bg-black/80" onClick={onClose}></div>
        </div>
    );
}