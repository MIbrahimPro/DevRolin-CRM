/**
 * User Service
 * Handles user profile and employee directory
 */

// FAKE DATA - Felix is the current user, others are the directory
const currentUserData = {
    id: "507f1f77bcf86cd799439011",
    name: "Felix Carter",
    email: "felix@sleepytaco.com",
    whatsapp: "+1 882 199 00",
    role: "Senior Product Designer",
    salary: "$12,000",
    avatar: "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=300",
    accountType: "Pro Account",
    isVerified: true
};

const employeesData = [
    currentUserData, // Include self in directory
    {
        id: "507f1f77bcf86cd799439012",
        name: "Sarah Carter",
        role: "Design Lead",
        whatsapp: "+1 555 012 88",
        email: "sarah@company.com",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        isVerified: true
    },
    {
        id: "507f1f77bcf86cd799439013",
        name: "Marcus Wright",
        role: "Project Manager",
        whatsapp: "+1 555 012 44",
        email: "marcus@company.com",
        avatar: "https://i.pravatar.cc/150?u=marcus",
        isVerified: true
    },
    {
        id: "507f1f77bcf86cd799439099",
        name: "Jordan Smith",
        role: "Developer",
        whatsapp: "+1 555 012 00",
        email: "jordan@company.com",
        avatar: "https://i.pravatar.cc/150?u=jordan",
        isVerified: false // Unverified example
    },
    {
        id: "547f1f77bcf86cd799439099",
        name: "Jordan Wooling",
        role: "Developer",
        whatsapp: "+1 555 012 00",
        email: "jordan@company.com",
        avatar: "https://i.pravatar.cc/150?u=jordan",
        isVerified: true
    },
    {
        id: "507f1f77b5f86cd799439099",
        name: "Jordan Tooler",
        role: "Developer",
        whatsapp: "+1 555 012 00",
        email: "jordan@company.com",
        avatar: "https://i.pravatar.cc/150?u=jordan",
        isVerified: true
    }
];

export const getCurrentUser = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(currentUserData), 300);
    });
};

export const getAllEmployees = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(employeesData), 300);
    });
};

export const updateUserProfile = async (fieldName, value) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            currentUserData[fieldName] = value;
            resolve(currentUserData);
        }, 300);
    });
};

export const logoutUser = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), 300);
    });
};

export default {
    getCurrentUser,
    getAllEmployees,
    updateUserProfile,
    logoutUser
};