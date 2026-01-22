/**
 * Job Service
 * Handles HR job requisitions and public invitation links
 */

const jobsData = [
    {
        id: "job_001",
        title: "Senior UI Designer",
        minExp: "5 Years",
        position: "Mid-Senior",
        salary: "$8,000 - $12,000",
        description: "We are looking for a designer to lead our mobile app initiative.",
        requirements: "Figma, Framer, React basics, 5+ years in SaaS.",
        status: "Open",
        createdAt: "2024-03-20"
    },
    {
        id: "job_002",
        title: "Backend Engineer",
        minExp: "3 Years",
        position: "Junior-Mid",
        salary: "$5,000 - $7,000",
        description: "Maintaining our Node.js microservices.",
        requirements: "Node.js, PostgreSQL, Redis, Docker.",
        status: "Pending",
        createdAt: "2024-03-21"
    }
];

export const getAllJobs = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(jobsData), 300);
    });
};

export const updateJobDetails = async (jobId, updates) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = jobsData.findIndex(j => j.id === jobId);
            if (index !== -1) {
                // HR can only update description and requirements
                jobsData[index].description = updates.description;
                jobsData[index].requirements = updates.requirements;
            }
            resolve(jobsData[index]);
        }, 500);
    });
};

export default {
    getAllJobs,
    updateJobDetails
};