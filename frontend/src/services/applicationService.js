/**
 * Application Service
 * Handles candidate submissions for specific jobs
 */

const applicationsData = [
    {
        id: "app_001",
        jobId: "job_001",
        name: "Dianne Russell",
        email: "dianne.r@gmail.com",
        phone: "+1 555 0102",
        experience: "6 Years",
        bio: "Senior UI enthusiast with a focus on design systems.",
        pfp: "https://i.pravatar.cc/150?u=dianne",
        cvUrl: "./sample.pdf",
        appliedAt: "2024-03-22"
    },
    {
        id: "app_002",
        jobId: "job_001",
        name: "Robert Fox",
        email: "robert.design@outlook.com",
        phone: "+1 555 9922",
        experience: "4 Years",
        bio: "Passionate about user-centric experiences.",
        pfp: "https://i.pravatar.cc/150?u=robert",
        cvUrl: "./missing_file.pdf", // Testing fallback
        appliedAt: "2024-03-23"
    },
    {
        id: "app_002",
        jobId: "job_001",
        name: "Robert Fox",
        email: "robert.design@outlook.com",
        phone: "+1 555 9922",
        experience: "4 Years",
        bio: "Passionate about user-centric experiences.",
        pfp: "https://i.pravatar.cc/150?u=robert",
        cvUrl: "./missing_file.pdf", // Testing fallback
        appliedAt: "2024-03-23"
    },
    {
        id: "app_002",
        jobId: "job_001",
        name: "Robert Fox",
        email: "robert.design@outlook.com",
        phone: "+1 555 9922",
        experience: "4 Years",
        bio: "Passionate about user-centric experiences.",
        pfp: "https://i.pravatar.cc/150?u=robert",
        cvUrl: "./missing_file.pdf", // Testing fallback
        appliedAt: "2024-03-23"
    },
    {
        id: "app_002",
        jobId: "job_001",
        name: "Robert Fox",
        email: "robert.design@outlook.com",
        phone: "+1 555 9922",
        experience: "4 Years",
        bio: "Passionate about user-centric experiences.",
        pfp: "https://i.pravatar.cc/150?u=robert",
        cvUrl: "./missing_file.pdf", // Testing fallback
        appliedAt: "2024-03-23"
    },
    {
        id: "app_002",
        jobId: "job_001",
        name: "Robert Fox",
        email: "robert.design@outlook.com",
        phone: "+1 555 9922",
        experience: "4 Years",
        bio: "Passionate about user-centric experiences.",
        pfp: "https://i.pravatar.cc/150?u=robert",
        cvUrl: "./missing_file.pdf", // Testing fallback
        appliedAt: "2024-03-23"
    }
];

export const getApplicationsByJob = async (jobId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filtered = applicationsData.filter(app => app.jobId === jobId);
            resolve(filtered);
        }, 300);
    });
};

export default { getApplicationsByJob };