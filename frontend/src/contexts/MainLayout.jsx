import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, Settings, Menu, ChevronLeft, LogOut,
    Bell, User, Zap, MessageSquare, ChevronDown, Shield, Dot, Users, UsersRound
} from "lucide-react";
import { getCurrentUser } from "../services/userService";
import { getProjects } from "../services/projectService";
import { getChats } from "../services/contactService";
import { getGroups } from "../services/groupService";
import SidebarSection from "../components/SidebarSection";

export default function MainLayout() {
    const [expanded, setExpanded] = useState(true);
    const [openSections, setOpenSections] = useState({ projects: true, messages: true });
    const [currentUser, setCurrentUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [recentChats, setRecentChats] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme'));

    useEffect(() => {
        const observer = new MutationObserver(() => setTheme(document.documentElement.getAttribute('data-theme')));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    // Load user data and projects on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const [userData, projectsData, chatsData, groupsData] = await Promise.all([
                    getCurrentUser(),
                    getProjects(),
                    getChats(),
                    getGroups()
                ]);
                setCurrentUser(userData);
                setProjects(projectsData);
                // Combine chats and groups for sidebar, limit to 3
                const combined = [
                    ...chatsData.map(c => ({ ...c, isGroup: false })),
                    ...groupsData.map(g => ({ ...g, isGroup: true }))
                ].slice(0, 3);
                setRecentChats(combined);
            } catch (error) {
                console.error("Error loading layout data:", error);
            }
        };

        loadData();
    }, []);

    const isDark = theme?.includes('dark') || theme === 'nord';
    const logoSrc = isDark ? "/logo.png" : "/logo-b.png";

    const toggleSection = (section) => {
        if (!expanded) setExpanded(true);
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        /* Problem 4 Fix: Correct Drawer structure for mobile */
        <div className="drawer lg:drawer-open h-screen bg-base-200 overflow-hidden">
            <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col min-w-0">
                {/* --- NAVBAR --- */}
                <header className="h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        {/* Updated label with onClick to force expansion */}
                        <label
                            htmlFor="mobile-drawer"
                            className="lg:hidden btn btn-ghost btn-sm btn-circle"
                            onClick={() => setExpanded(true)}
                        >
                            <Menu size={20} />
                        </label>

                        <div className="flex items-center gap-2 text-xs font-bold">
                            <span className="opacity-20 uppercase tracking-widest text-[10px]">Portal</span>
                            {pathnames.map((name) => (
                                <div key={name} className="flex items-center gap-2 uppercase tracking-tighter">
                                    <span className="opacity-20">/</span>
                                    <span className="text-primary">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Problem 5: External Action Buttons */}
                        <div className="hidden sm:flex items-center gap-1">
                            <button className="btn btn-ghost btn-sm btn-circle opacity-60 hover:opacity-100">
                                <Bell size={18} />
                            </button>
                            <button onClick={() => navigate('/settings')} className="btn btn-ghost btn-sm btn-circle opacity-60 hover:opacity-100">
                                <Settings size={18} />
                            </button>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex items-center p-1 rounded-full bg-base-100 border border-base-300 hover:border-primary/50 transition-all"
                            >
                                <div className="avatar">
                                    {/* Added shrink-0 to prevent the avatar from squishing */}
                                    <div className="w-8 lg:w-9 rounded-full ring-1 ring-base-300 shrink-0">
                                        <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=100"} alt="user" />
                                    </div>
                                </div>

                                {/* FIX: We move the gap and the right padding HERE. 
           Since this entire div is hidden on mobile, the extra space disappears!
        */}
                                <div className="hidden sm:flex flex-col items-start gap-0.5 ml-3 pr-4 lg:pr-5">
                                    <span className="text-[11px] font-black leading-tight whitespace-nowrap">{currentUser?.name || "User"}</span>
                                    <span className="text-[9px] opacity-40 uppercase tracking-tighter leading-tight whitespace-nowrap">{currentUser?.accountType || "Account"}</span>
                                </div>
                            </div>

                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-2xl w-52 mt-2 border border-base-300 z-50">
                                <li><button onClick={() => navigate('/profile')}><User size={16} /> Profile</button></li>
                                <li className="sm:hidden"><button onClick={() => navigate('/settings')}><Settings size={16} /> Settings</button></li>
                                <div className="divider my-1 px-4 opacity-10"></div>
                                <li className="text-error"><button><LogOut size={16} /> Sign out</button></li>
                            </ul>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-4 lg:px-12 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* --- SIDEBAR --- */}
            <div className="drawer-side z-40">
                <label htmlFor="mobile-drawer" className="drawer-overlay"></label>
                <aside className={`h-full flex flex-col border-r border-base-300 bg-base-100 transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-20'}`}>

                    {/* Problem 2 Fix: Logo Centering in Collapsed Mode */}
                    <div className="h-16 flex items-center justify-between px-6 shrink-0">
                        {expanded ? (
                            <img src={logoSrc} alt="DevRolin" className="h-5 w-auto object-contain" />
                        ) : (
                            <div className="w-full flex justify-center">
                                <div className="size-2 rounded-full bg-primary" />
                            </div>
                        )}
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="hidden lg:flex p-1.5 rounded-lg hover:bg-base-200"
                        >
                            <ChevronLeft size={16} className={`transition-transform duration-500 ${!expanded && 'rotate-180'}`} />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto no-scrollbar">
                        <Link
                            to="/dashboard"
                            className={`flex items-center h-10 px-3 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-200 opacity-70'}`}
                        >
                            {/* Fixed width container for icon keeps it centered even when collapsed */}
                            <div className="w-9 flex items-center justify-center shrink-0">
                                <LayoutDashboard size={18} />
                            </div>
                            {expanded && <span className="text-sm font-bold ml-1">Dashboard</span>}
                        </Link>
                        <Link
                            to="/employee-manage"
                            className={`flex items-center h-10 px-3 rounded-xl transition-all ${location.pathname === '/employee-manage' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-200 opacity-70'}`}
                        >
                            {/* Fixed width container for icon keeps it centered even when collapsed */}
                            <div className="w-9 flex items-center justify-center shrink-0">
                                <UsersRound size={18} />
                            </div>
                            {expanded && <span className="text-sm font-bold ml-1">Manage Employees</span>}
                        </Link>

                        {/* PROJECTS SECTION */}
                        <SidebarSection
                            icon={Zap}
                            label="Projects"
                            expanded={expanded}
                            isOpen={openSections.projects}
                            onToggle={() => toggleSection('projects')}
                            onNavigate={() => navigate('/projects')}
                        >
                            {projects.map(p => (
                                <button key={p.id} className="flex items-center w-full pl-5 py-1.5 text-[11px] font-medium opacity-60 hover:opacity-100 hover:text-primary transition-all text-left truncate">{p.name}</button>
                            ))}
                        </SidebarSection>

                        {/* MESSAGES SECTION */}
                        <SidebarSection
                            icon={MessageSquare}
                            label="Messages"
                            expanded={expanded}
                            isOpen={openSections.messages}
                            onToggle={() => toggleSection('messages')}
                            onNavigate={() => navigate('/contacts')}
                        >
                            {recentChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => navigate(`/chat/${chat.id}`)}
                                    className={`flex items-center justify-between w-full pl-5 py-2 text-[11px] font-medium transition-all text-left truncate group ${location.pathname.includes(`/chat/${chat.id}`) ? 'text-primary opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <div className={`size-1.5 rounded-full ${chat.unread ? 'bg-primary' : 'bg-base-300'}`} />
                                        <span className="truncate">{chat.name}</span>
                                    </div>
                                    {chat.isGroup && <Users size={10} className="mr-2 opacity-40" />}
                                </button>
                            ))}
                        </SidebarSection>
                    </nav>

                    <div className="p-4 mt-auto">
                        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-base-200/50 border border-base-300 ${!expanded ? 'justify-center' : ''}`}>
                            <Shield size={16} className="opacity-40 shrink-0" />
                            {expanded && <p className="text-[10px] font-black uppercase opacity-40">Secure Session</p>}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}