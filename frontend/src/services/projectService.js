/**
 * Project Service
 * Handles all project-related API calls
 * Currently returns fake data - easy to replace with real API calls
 */

// FAKE DATA - Replace with API calls when backend is ready
const projectsData = [
    {
        id: "507f1f77bcf86cd799439018",
        name: "Project Alpha",
        description: "Major product redesign initiative",
        status: "in-progress",
        progress: 65,
        members: 8,
        dueDate: "2026-03-15",
        avatar: "https://i.pravatar.cc/150?u=alpha",
        createdAt: "2025-12-01"
    },
    {
        id: "507f1f77bcf86cd799439019",
        name: "User Flow UX",
        description: "Improving user experience flows",
        status: "in-progress",
        progress: 45,
        members: 5,
        dueDate: "2026-02-28",
        avatar: "https://i.pravatar.cc/150?u=ux",
        createdAt: "2025-11-20"
    },
    {
        id: "507f1f77bcf86cd799439020",
        name: "API Integration",
        description: "Backend API integration and testing",
        status: "planning",
        progress: 20,
        members: 6,
        dueDate: "2026-04-30",
        avatar: "https://i.pravatar.cc/150?u=api",
        createdAt: "2025-12-15"
    },
];

/**
 * Get all projects for the current user
 * @returns {Promise<Array>} Array of projects
 */
export const getProjects = async () => {
    // TODO: Replace with actual API call
    // return api.get('/projects');

    return new Promise((resolve) => {
        setTimeout(() => resolve(projectsData), 300);
    });
};

/**
 * Get a specific project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project object
 */
export const getProjectById = async (projectId) => {
    // TODO: Replace with actual API call
    // return api.get(`/projects/${projectId}`);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const project = projectsData.find(p => p.id === projectId);
            if (project) {
                resolve(project);
            } else {
                reject(new Error("Project not found"));
            }
        }, 300);
    });
};

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} Created project object
 */
export const createProject = async (projectData) => {
    // TODO: Replace with actual API call
    // return api.post('/projects', projectData);

    return new Promise((resolve) => {
        setTimeout(() => {
            const newProject = {
                id: `507f1f77bcf86cd79943901${projectsData.length + 1}`,
                ...projectData,
                progress: 0,
                createdAt: new Date().toISOString()
            };
            projectsData.push(newProject);
            resolve(newProject);
        }, 300);
    });
};

/**
 * Update a project
 * @param {string} projectId - Project ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated project object
 */
export const updateProject = async (projectId, updateData) => {
    // TODO: Replace with actual API call
    // return api.patch(`/projects/${projectId}`, updateData);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const projectIndex = projectsData.findIndex(p => p.id === projectId);
            if (projectIndex !== -1) {
                projectsData[projectIndex] = { ...projectsData[projectIndex], ...updateData };
                resolve(projectsData[projectIndex]);
            } else {
                reject(new Error("Project not found"));
            }
        }, 300);
    });
};

export default {
    getProjects,
    getProjectById,
    createProject,
    updateProject
};
