import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Send, Paperclip, Smile, MoreVertical, CheckCheck } from "lucide-react";
import { getContactById, getMessagesByContactId, sendMessage } from "../services/contactService";
import { getGroupById, getGroupMessages, sendGroupMessage } from "../services/groupService";

export default function ChatDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [contact, setContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGroup, setIsGroup] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                let contactData, messagesData;

                // Try to load as a direct contact first
                try {
                    contactData = await getContactById(id);
                    messagesData = await getMessagesByContactId(id);
                    setIsGroup(false);
                } catch {
                    // If not found as contact, try as group
                    contactData = await getGroupById(id);
                    messagesData = await getGroupMessages(id);
                    setIsGroup(true);
                }

                setContact(contactData);
                setMessages(messagesData);
            } catch (error) {
                console.error("Error loading chat:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        try {
            const newMessage = isGroup
                ? await sendGroupMessage(id, message)
                : await sendMessage(id, message);

            setMessages([...messages, newMessage]);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-base-100 border border-base-300 rounded-box overflow-hidden shadow-sm">

            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
            ) : contact ? (
                <>
                    {/* CHAT HEADER */}
                    <div className="px-6 py-4 border-b border-base-300 flex items-center justify-between bg-base-200/30">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/contacts')} className="btn btn-ghost btn-sm btn-circle">
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className={`avatar ${!isGroup && contact.online ? 'online' : ''}`}>
                                    <div className="w-10 rounded-box ring-1 ring-base-300">
                                        <img src={contact.avatar} alt={contact.name} />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-sm font-black leading-none">{contact.name}</h2>
                                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">{contact.role || contact.description || "Member"}</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-sm btn-circle opacity-40"><MoreVertical size={18} /></button>
                    </div>

                    {/* MESSAGES AREA */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-base-100">
                        {messages.length > 0 ? (
                            messages.map(msg => (
                                <div key={msg.id} className={`chat ${msg.sender === "507f1f77bcf86cd799439011" ? 'chat-end' : 'chat-start'}`}>
                                    {isGroup && msg.sender !== "507f1f77bcf86cd799439011" && (
                                        <div className="chat-header text-[10px] font-bold opacity-50 mb-1">
                                            {msg.senderName}
                                        </div>
                                    )}
                                    <div className={`chat-bubble ${msg.sender === "507f1f77bcf86cd799439011" ? 'bg-primary text-primary-content shadow-lg shadow-primary/10' : 'bg-base-200 text-base-content border border-base-300'} rounded-box font-medium text-sm`}>
                                        {msg.content}
                                    </div>
                                    <div className="chat-footer opacity-40 text-[10px] mt-1 font-bold flex gap-1 items-center px-1">
                                        {msg.timestamp}
                                        {msg.sender === "507f1f77bcf86cd799439011" && msg.read && <CheckCheck size={12} className="text-primary" />}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-xs opacity-40 py-8">No messages yet</p>
                        )}
                    </div>

                    {/* INPUT AREA */}
                    <div className="p-4 border-t border-base-300 bg-base-100">
                        <div className="flex items-center gap-3 bg-base-200/50 p-2 rounded-box border border-base-300">
                            <button className="btn btn-ghost btn-sm btn-circle opacity-40"><Paperclip size={18} /></button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message..."
                                className="input input-ghost input-sm flex-1 focus:bg-transparent focus:outline-none font-medium"
                            />
                            <button className="btn btn-ghost btn-sm btn-circle opacity-40"><Smile size={18} /></button>
                            <button onClick={handleSendMessage} className="btn btn-primary btn-sm rounded-btn px-5 h-9 font-black text-[10px] uppercase">
                                Send
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-center text-xs opacity-40">Chat not found</p>
                </div>
            )}
        </div>
    );
}