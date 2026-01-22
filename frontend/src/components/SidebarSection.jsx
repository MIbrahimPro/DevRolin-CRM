import { ChevronDown, ExternalLink } from "lucide-react";

export default function SidebarSection({
    icon: Icon,
    label,
    expanded,
    isOpen,
    onToggle,
    children,
    onNavigate
}) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between px-3 group/row h-10">
                {/* GROUP 1: Icon + Label (Toggle) */}
                <button
                    onClick={onToggle}
                    className="flex items-center flex-1 h-full"
                >
                    {/* Centered Icon Container - same width as Dashboard link above */}
                    <div className="w-9 flex items-center justify-center shrink-0 relative">
                        <Icon
                            size={18}
                            className="group-hover/row:hidden text-base-content opacity-40"
                        />
                        <ChevronDown
                            size={18}
                            className={`hidden group-hover/row:block text-primary transition-transform ${!isOpen && '-rotate-90'}`}
                        />
                    </div>

                    {expanded && (
                        <span className="ml-1 font-black text-[10px] uppercase tracking-widest opacity-40 group-hover/row:opacity-100 transition-opacity">
                            {label}
                        </span>
                    )}
                </button>

                {/* GROUP 2: Navigate Icon */}
                {expanded && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNavigate();
                        }}
                        className="p-1 rounded opacity-0 group-hover/row:opacity-40 hover:!opacity-100 hover:bg-base-200 transition-all ml-auto"
                    >
                        <ExternalLink size={14} />
                    </button>
                )}
            </div>

            {expanded && isOpen && (
                <div className="ml-7 mt-1 border-l border-base-300 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
}