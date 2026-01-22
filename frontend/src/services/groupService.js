/**
 * Group Service
 * Handles all team channels and group-related API calls
 * Currently returns fake data - easy to replace with real API calls
 */

// FAKE DATA - Replace with API calls when backend is ready
const groupsData = [
    {
        id: "507f1f77bcf86cd799439015",
        name: "Design Team",
        lastMsg: "Sarah: New assets uploaded",
        time: "09:15 AM",
        unread: 12,
        avatar: "https://i.pravatar.cc/150?u=team",
        members: 8,
        description: "Design team collaboration channel",
        createdAt: "2025-01-15"
    },
    {
        id: "507f1f77bcf86cd799439016",
        name: "Project X",
        lastMsg: "John joined the group",
        time: "Yesterday",
        unread: 0,
        avatar: "https://i.pravatar.cc/150?u=project",
        members: 12,
        description: "Project X development updates",
        createdAt: "2025-01-10"
    },
];

const groupMessagesData = {
    "507f1f77bcf86cd799439015": [
        {
            id: "grpmsg_001",
            sender: "507f1f77bcf86cd799439012",
            senderName: "Sarah Carter",
            content: "New assets uploaded",
            timestamp: "09:15 AM",
            read: true
        }
    ],
    "507f1f77bcf86cd799439016": [
        {
            id: "grpmsg_002",
            sender: "507f1f77bcf86cd799439017",
            senderName: "John Developer",
            content: "John joined the group",
            timestamp: "Yesterday",
            read: true
        }
    ]
};

/**
 * Get all team group channels
 * @returns {Promise<Array>} Array of groups
 */
export const getGroups = async () => {
    // TODO: Replace with actual API call
    // return api.get('/groups');

    return new Promise((resolve) => {
        setTimeout(() => resolve(groupsData), 300);
    });
};

/**
 * Get a specific group by ID
 * @param {string} groupId - Group ID
 * @returns {Promise<Object>} Group object
 */
export const getGroupById = async (groupId) => {
    // TODO: Replace with actual API call
    // return api.get(`/groups/${groupId}`);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const group = groupsData.find(g => g.id === groupId);
            if (group) {
                resolve(group);
            } else {
                reject(new Error("Group not found"));
            }
        }, 300);
    });
};

/**
 * Get all messages in a group
 * @param {string} groupId - Group ID
 * @returns {Promise<Array>} Array of group messages
 */
export const getGroupMessages = async (groupId) => {
    // TODO: Replace with actual API call
    // return api.get(`/groups/${groupId}/messages`);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(groupMessagesData[groupId] || []);
        }, 300);
    });
};

/**
 * Send a message to a group
 * @param {string} groupId - Group ID
 * @param {string} content - Message content
 * @returns {Promise<Object>} Sent message object
 */
export const sendGroupMessage = async (groupId, content) => {
    // TODO: Replace with actual API call
    // return api.post(`/groups/${groupId}/messages`, { content });

    return new Promise((resolve) => {
        setTimeout(() => {
            const newMessage = {
                id: `grpmsg_${Date.now()}`,
                sender: "507f1f77bcf86cd799439011",
                senderName: "Felix Carter",
                content,
                timestamp: new Date().toLocaleTimeString(),
                read: true
            };
            if (!groupMessagesData[groupId]) {
                groupMessagesData[groupId] = [];
            }
            groupMessagesData[groupId].push(newMessage);
            resolve(newMessage);
        }, 300);
    });
};

export default {
    getGroups,
    getGroupById,
    getGroupMessages,
    sendGroupMessage
};
