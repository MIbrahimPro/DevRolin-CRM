/**
 * Contact Service
 * Handles all direct message contacts
 * Currently returns fake data - easy to replace with real API calls
 */

// FAKE DATA - Replace with API calls when backend is ready
const chatsData = [
    {
        id: "507f1f77bcf86cd799439012",
        name: "Sarah Carter",
        role: "Design Lead",
        lastMsg: "The project alpha files...",
        time: "12:45 PM",
        unread: 2,
        online: true,
        avatar: "https://i.pravatar.cc/150?u=sarah",
        email: "sarah@company.com"
    },
    {
        id: "507f1f77bcf86cd799439013",
        name: "Marcus Wright",
        role: "Project Manager",
        lastMsg: "See you at the meeting",
        time: "10:20 AM",
        unread: 0,
        online: false,
        avatar: "https://i.pravatar.cc/150?u=marcus",
        email: "marcus@company.com"
    },
    {
        id: "507f1f77bcf86cd799439014",
        name: "Elena Fisher",
        role: "Developer",
        lastMsg: "Are we still on for lunch?",
        time: "Monday",
        unread: 0,
        online: true,
        avatar: "https://i.pravatar.cc/150?u=elena",
        email: "elena@company.com"
    },
];

const messagesData = {
    "507f1f77bcf86cd799439012": [
        {
            id: "msg_001",
            sender: "507f1f77bcf86cd799439012",
            content: "The project alpha files are uploaded. Ready for review?",
            timestamp: "12:45 PM",
            read: true
        },
        {
            id: "msg_002",
            sender: "507f1f77bcf86cd799439011",
            content: "Checking them now. I'll get back to you in 10 minutes.",
            timestamp: "12:46 PM",
            read: true
        }
    ],
    "507f1f77bcf86cd799439013": [
        {
            id: "msg_003",
            sender: "507f1f77bcf86cd799439013",
            content: "See you at the meeting",
            timestamp: "10:20 AM",
            read: true
        }
    ],
    "507f1f77bcf86cd799439014": [
        {
            id: "msg_004",
            sender: "507f1f77bcf86cd799439014",
            content: "Are we still on for lunch?",
            timestamp: "Monday",
            read: false
        }
    ]
};

/**
 * Get all direct message contacts
 * @returns {Promise<Array>} Array of chat contacts
 */
export const getChats = async () => {
    // TODO: Replace with actual API call
    // return api.get('/chats');

    return new Promise((resolve) => {
        setTimeout(() => resolve(chatsData), 300);
    });
};

/**
 * Get a specific contact by ID
 * @param {string} contactId - Contact ID
 * @returns {Promise<Object>} Contact object
 */
export const getContactById = async (contactId) => {
    // TODO: Replace with actual API call
    // return api.get(`/chats/${contactId}`);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const contact = chatsData.find(c => c.id === contactId);
            if (contact) {
                resolve(contact);
            } else {
                reject(new Error("Contact not found"));
            }
        }, 300);
    });
};

/**
 * Get all messages for a specific contact
 * @param {string} contactId - Contact ID
 * @returns {Promise<Array>} Array of messages
 */
export const getMessagesByContactId = async (contactId) => {
    // TODO: Replace with actual API call
    // return api.get(`/messages/${contactId}`);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(messagesData[contactId] || []);
        }, 300);
    });
};

/**
 * Send a message to a contact
 * @param {string} contactId - Contact ID
 * @param {string} content - Message content
 * @returns {Promise<Object>} Sent message object
 */
export const sendMessage = async (contactId, content) => {
    // TODO: Replace with actual API call
    // return api.post(`/messages/${contactId}`, { content });

    return new Promise((resolve) => {
        setTimeout(() => {
            const newMessage = {
                id: `msg_${Date.now()}`,
                sender: "507f1f77bcf86cd799439011", // Current user
                content,
                timestamp: new Date().toLocaleTimeString(),
                read: true
            };
            if (!messagesData[contactId]) {
                messagesData[contactId] = [];
            }
            messagesData[contactId].push(newMessage);
            resolve(newMessage);
        }, 300);
    });
};

export default {
    getChats,
    getContactById,
    getMessagesByContactId,
    sendMessage
};
