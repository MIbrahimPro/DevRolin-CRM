import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCheck, MessageSquare, Users } from "lucide-react";
import { getChats } from "../services/contactService";
import { getGroups } from "../services/groupService";

export default function ContactsPage() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [groupsData, chatsData] = await Promise.all([
                    getGroups(),
                    getChats()
                ]);
                setGroups(groupsData);
                setChats(chatsData);
            } catch (error) {
                console.error("Error loading contacts:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const ContactItem = ({ item }) => (
        <div
            onClick={() => navigate(`/chat/${item.id}`)}
            className="flex items-center gap-4 px-6 py-4 hover:bg-base-200/30 cursor-pointer transition-all border-b border-base-200/50 last:border-none"
        >
            <div className={`avatar ${item.online ? 'online' : ''}`}>
                <div className="w-11 rounded-box ring-1 ring-base-300">
                    <img src={item.avatar} alt={item.name} />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-sm font-black truncate">{item.name}</h3>
                    <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{item.time}</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xs font-medium opacity-50 truncate pr-4">{item.lastMsg}</p>
                    {item.unread > 0 ? (
                        <div className="badge badge-primary font-black text-[9px] h-5 min-w-[20px] rounded-btn border-none shadow-sm shadow-primary/20">
                            {item.unread}
                        </div>
                    ) : (
                        <CheckCheck size={14} className="opacity-10 text-primary" />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-base-100 border border-base-300 rounded-box overflow-hidden shadow-sm">

            {/* MATCHING HEADER STYLE */}
            <div className="px-6 py-5 border-b border-base-300 flex items-center justify-between bg-base-200/30">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-box text-primary">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black leading-none uppercase tracking-tighter">Messages & Groups</h2>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Recent Activity</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="badge badge-ghost font-black text-[10px] opacity-40 py-3 uppercase">Beta</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">

                {/* GROUPS DIVIDER */}
                <div className="divider px-6 before:bg-base-300/50 after:bg-base-300/50">
                    <div className="flex items-center gap-2 opacity-30">
                        <Users size={12} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Team Channels</span>
                    </div>
                </div>
                <div className="mb-2">
                    {groups.length > 0 ? groups.map(group => <ContactItem key={group.id} item={group} />) : <p className="text-center text-xs opacity-40 py-4">No groups yet</p>}
                </div>

                {/* CHATS DIVIDER */}
                <div className="divider px-6 before:bg-base-300/50 after:bg-base-300/50">
                    <div className="flex items-center gap-2 opacity-30">
                        <MessageSquare size={12} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Direct Messages</span>
                    </div>
                </div>
                <div>
                    {chats.length > 0 ? chats.map(chat => <ContactItem key={chat.id} item={chat} />) : <p className="text-center text-xs opacity-40 py-4">No chats yet</p>}
                </div>

            </div>
        </div>
    );
}