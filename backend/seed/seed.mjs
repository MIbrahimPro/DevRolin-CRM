import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import User from '../models/User.mjs';
import Employee from '../models/Employee.mjs';
import Client from '../models/Client.mjs';
import Project from '../models/Project.mjs';
import Task from '../models/Task.mjs';
import Document from '../models/Document.mjs';
import Chat from '../models/Chat.mjs';
import Attendance from '../models/Attendance.mjs';
import Leave from '../models/Leave.mjs';
import Recruitment from '../models/Recruitment.mjs';
import Question from '../models/Question.mjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devrolin-crm';

const argv = process.argv.slice(2);
const shouldReset = argv.includes('--reset') || argv.includes('-r');
const seedValue = (() => {
    const idx = argv.findIndex(a => a === '--seed');
    if (idx !== -1 && argv[idx + 1]) return Number(argv[idx + 1]);
    const envSeed = process.env.SEED;
    return envSeed ? Number(envSeed) : 1337;
})();

faker.seed(Number.isFinite(seedValue) ? seedValue : 1337);

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
}

async function connect() {
    await mongoose.connect(MONGODB_URI);
}

async function resetDatabase() {
    // Delete in dependency order to avoid weirdness with refs/populates.
    await Promise.all([
        Attendance.deleteMany({}),
        Leave.deleteMany({}),
        Question.deleteMany({}),
        Recruitment.deleteMany({}),
        Task.deleteMany({}),
        Document.deleteMany({}),
        Chat.deleteMany({}),
        Project.deleteMany({}),
        Client.deleteMany({}),
        Employee.deleteMany({}),
        User.deleteMany({})
    ]);
}

async function seedUsers() {
    // Fixed logins so you can immediately test the UI.
    const basePassword = 'Password123!';

    const users = await User.create([
        { email: 'admin@devrolin.local', password: basePassword, role: 'admin', preferences: { theme: 'dark' } },
        { email: 'pm@devrolin.local', password: basePassword, role: 'pm', preferences: { theme: 'light' } },
        { email: 'hr@devrolin.local', password: basePassword, role: 'hr', preferences: { theme: 'light' } },
        { email: 'employee@devrolin.local', password: basePassword, role: 'employee', preferences: { theme: 'dark' } },
        { email: 'client@devrolin.local', password: basePassword, role: 'client', preferences: { theme: 'light' } }
    ]);

    return {
        basePassword,
        adminUser: users[0],
        pmUser: users[1],
        hrUser: users[2],
        employeeUser: users[3],
        clientUser: users[4]
    };
}

async function seedEmployees({ pmUser, hrUser, employeeUser }) {
    const departments = ['Engineering', 'HR', 'Product', 'Design', 'Finance', 'Operations'];
    const positions = ['Software Engineer', 'Senior Engineer', 'QA Engineer', 'Product Manager', 'HR Specialist', 'Designer'];

    const pmEmployee = await Employee.create({
        user: pmUser._id,
        firstName: 'Noor',
        lastName: 'PM',
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        department: 'Product',
        position: 'Project Manager',
        employeeId: 'EMP-PM-0001',
        hireDate: daysAgo(500),
        employmentType: 'full-time',
        workMode: 'hybrid',
        salary: 90000
    });

    const hrEmployee = await Employee.create({
        user: hrUser._id,
        firstName: 'Hana',
        lastName: 'HR',
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        department: 'HR',
        position: 'HR Manager',
        employeeId: 'EMP-HR-0001',
        hireDate: daysAgo(650),
        employmentType: 'full-time',
        workMode: 'onsite',
        salary: 85000
    });

    const coreEmployee = await Employee.create({
        user: employeeUser._id,
        firstName: 'Eman',
        lastName: 'Employee',
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        department: 'Engineering',
        position: 'Software Engineer',
        employeeId: 'EMP-DEV-0001',
        hireDate: daysAgo(200),
        employmentType: 'full-time',
        workMode: 'remote',
        manager: pmEmployee._id,
        salary: 75000,
        performance: [
            {
                reviewPeriod: '2025-H2',
                rating: 4,
                feedback: 'Strong ownership, good communication.',
                reviewedBy: pmEmployee._id
            }
        ]
    });

    // Additional employees for richer scenarios.
    const extraEmployees = [];
    for (let i = 0; i < 10; i++) {
        const dept = pick(departments);
        extraEmployees.push({
            user: (await User.create({
                email: `user${i + 1}@devrolin.local`,
                password: 'Password123!',
                role: pick(['employee', 'employee', 'employee', 'pm', 'hr']),
                preferences: { theme: pick(['light', 'dark']) }
            }))._id,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
            department: dept,
            position: pick(positions),
            employeeId: `EMP-${String(i + 2).padStart(4, '0')}`,
            hireDate: faker.date.between({ from: daysAgo(1200), to: daysAgo(30) }),
            employmentType: pick(['full-time', 'part-time', 'contract']),
            workMode: pick(['onsite', 'remote', 'hybrid']),
            manager: pmEmployee._id,
            leaveBalance: faker.number.int({ min: 5, max: 30 }),
            salary: faker.number.int({ min: 35000, max: 140000 })
        });
    }

    const createdExtras = await Employee.insertMany(extraEmployees);
    return { pmEmployee, hrEmployee, coreEmployee, employees: [pmEmployee, hrEmployee, coreEmployee, ...createdExtras] };
}

async function seedClients({ clientUser, createdByEmployee }) {
    const mainClient = await Client.create({
        user: clientUser._id,
        companyName: 'DevRolin Client Co',
        contactName: 'Cameron Client',
        email: clientUser.email,
        phone: faker.phone.number(),
        createdBy: createdByEmployee._id,
        projects: []
    });

    // More clients
    const others = [];
    for (let i = 0; i < 4; i++) {
        const u = await User.create({
            email: `client${i + 1}@devrolin.local`,
            password: 'Password123!',
            role: 'client',
            preferences: { theme: pick(['light', 'dark']) }
        });
        others.push({
            user: u._id,
            companyName: faker.company.name(),
            contactName: faker.person.fullName(),
            email: u.email,
            phone: faker.phone.number(),
            createdBy: createdByEmployee._id,
            projects: []
        });
    }

    const otherClients = await Client.insertMany(others);
    return { clients: [mainClient, ...otherClients] };
}

async function seedProjectsTasksDocsChats({ pmEmployee, employees, clients, adminUser }) {
    const statuses = ['pending', 'approved', 'active', 'on-hold', 'completed', 'cancelled'];

    const projects = [];
    for (let i = 0; i < 8; i++) {
        const client = pick(clients);
        const startDate = faker.date.between({ from: daysAgo(300), to: daysAgo(10) });
        const endDate = faker.date.between({ from: startDate, to: daysAgo(-60) });

        const team = faker.helpers.arrayElements(
            employees.filter(e => e._id.toString() !== pmEmployee._id.toString()),
            { min: 2, max: 6 }
        );

        projects.push({
            name: `${faker.company.buzzNoun()} ${faker.company.buzzVerb()} Platform`,
            description: faker.lorem.paragraph(),
            status: pick(statuses),
            pm: pmEmployee._id,
            team: team.map(t => t._id),
            client: client._id,
            budget: faker.number.int({ min: 5000, max: 250000 }),
            timeline: { startDate, endDate },
            approvedBy: adminUser?._id,
            approvedAt: faker.date.recent({ days: 60 })
        });
    }

    const createdProjects = await Project.insertMany(projects);

    // Link projects onto clients
    for (const p of createdProjects) {
        await Client.updateOne({ _id: p.client }, { $addToSet: { projects: p._id } });
    }

    // Create chats per project
    const chatsByProjectId = new Map();
    for (const p of createdProjects) {
        const participants = faker.helpers.arrayElements(employees, { min: 3, max: 8 }).map(e => e._id);
        const messages = Array.from({ length: faker.number.int({ min: 5, max: 20 }) }).map(() => {
            const sender = pick(employees);
            return {
                sender: sender._id,
                content: faker.lorem.sentence(),
                attachments: Math.random() < 0.2 ? [{ name: 'spec.pdf', url: '/uploads/spec.pdf', type: 'pdf' }] : []
            };
        });

        const chat = await Chat.create({
            project: p._id,
            participants,
            messages
        });
        chatsByProjectId.set(p._id.toString(), chat);
        await Project.updateOne({ _id: p._id }, { chat: chat._id });
    }

    // Create tasks, documents, and wire them
    const taskStatuses = ['todo', 'in-progress', 'review', 'completed', 'rejected'];
    const taskPriorities = ['low', 'medium', 'high', 'urgent'];

    const createdTasks = [];
    const createdDocuments = [];

    for (const p of createdProjects) {
        // Requirement doc per project
        const reqDoc = await Document.create({
            title: `${p.name} - Requirements`,
            content: {
                type: 'doc',
                blocks: [{ type: 'paragraph', content: `Requirements for ${p.name}` }]
            },
            project: p._id,
            createdBy: pmEmployee._id,
            versions: [
                {
                    content: { type: 'doc', blocks: [{ type: 'paragraph', content: 'Initial requirements.' }] },
                    versionNumber: 1,
                    createdBy: pmEmployee._id
                }
            ],
            sharedWith: []
        });
        createdDocuments.push(reqDoc);
        await Project.updateOne({ _id: p._id }, { requirements: reqDoc._id, $addToSet: { documents: reqDoc._id } });

        const taskCount = faker.number.int({ min: 6, max: 18 });
        for (let i = 0; i < taskCount; i++) {
            const creator = pick(employees);
            const assignees = faker.helpers.arrayElements(employees, { min: 1, max: 3 }).map(e => e._id);
            const status = pick(taskStatuses);
            const progress = status === 'completed' ? 100 : status === 'todo' ? 0 : faker.number.int({ min: 5, max: 95 });

            const task = await Task.create({
                title: faker.hacker.phrase(),
                description: faker.lorem.paragraph(),
                project: p._id,
                createdBy: creator._id,
                assignedTo: assignees,
                status,
                priority: pick(taskPriorities),
                deadline: faker.date.between({ from: daysAgo(30), to: daysAgo(-90) }),
                progress,
                milestones: [
                    {
                        title: 'Milestone 1',
                        description: faker.lorem.sentence(),
                        steps: [
                            { title: 'Step A', completed: Math.random() < 0.6, completedAt: faker.date.recent({ days: 30 }) },
                            { title: 'Step B', completed: Math.random() < 0.4, completedAt: faker.date.recent({ days: 30 }) }
                        ],
                        completed: Math.random() < 0.3,
                        completedAt: faker.date.recent({ days: 30 })
                    }
                ],
                feedback: [
                    {
                        message: faker.lorem.sentence(),
                        givenBy: creator._id
                    }
                ],
                submittedAt: status === 'review' || status === 'completed' ? faker.date.recent({ days: 20 }) : undefined,
                reviewedAt: status === 'completed' || status === 'rejected' ? faker.date.recent({ days: 10 }) : undefined,
                reviewedBy: status === 'completed' || status === 'rejected' ? pmEmployee._id : undefined
            });

            createdTasks.push(task);

            if (Math.random() < 0.5) {
                const doc = await Document.create({
                    title: `${task.title} - Notes`,
                    content: {
                        type: 'doc',
                        blocks: [{ type: 'paragraph', content: faker.lorem.paragraph() }]
                    },
                    project: p._id,
                    task: task._id,
                    createdBy: creator._id,
                    isLiveShared: Math.random() < 0.2,
                    sharedWith: [
                        {
                            user: adminUser?._id,
                            mode: pick(['static', 'live'])
                        }
                    ],
                    versions: [
                        { content: { type: 'doc', blocks: [{ type: 'paragraph', content: 'v1' }] }, versionNumber: 1, createdBy: creator._id }
                    ]
                });
                createdDocuments.push(doc);
                await Task.updateOne({ _id: task._id }, { $addToSet: { documents: doc._id } });
                await Project.updateOne({ _id: p._id }, { $addToSet: { documents: doc._id } });
            }
        }
    }

    return { projects: createdProjects, tasks: createdTasks, documents: createdDocuments };
}

async function seedAttendanceAndLeaves({ employees }) {
    // Attendance: last 21 days with mixed scenarios (present/absent/half-day/leave).
    const attendanceDocs = [];
    for (const emp of employees) {
        for (let day = 1; day <= 21; day++) {
            const date = daysAgo(day);
            date.setHours(0, 0, 0, 0);

            const status = pick(['present', 'present', 'present', 'half-day', 'absent', 'leave']);
            if (status === 'leave') continue; // We'll represent leave via Leave collection.

            const checkInTime = new Date(date);
            checkInTime.setHours(9, faker.number.int({ min: 0, max: 45 }), 0, 0);

            const checkOutTime = new Date(date);
            checkOutTime.setHours(status === 'half-day' ? 13 : 18, faker.number.int({ min: 0, max: 45 }), 0, 0);

            const totalHours = status === 'absent' ? 0 : status === 'half-day' ? 4 : 8;

            attendanceDocs.push({
                employee: emp._id,
                date,
                checkIn: { time: checkInTime, location: pick(['remote', 'onsite']) },
                checkOut: status === 'absent' ? undefined : { time: checkOutTime, location: pick(['remote', 'onsite']) },
                totalHours,
                status
            });
        }
    }
    if (attendanceDocs.length) {
        await Attendance.insertMany(attendanceDocs, { ordered: false }).catch(() => { });
    }

    // Leaves: create pending/approved/rejected/cancelled, flagged too.
    const leaveTypes = ['sick', 'vacation', 'personal', 'maternity', 'paternity', 'emergency'];
    const statuses = ['pending', 'approved', 'rejected', 'cancelled'];
    const leaves = [];
    for (let i = 0; i < 25; i++) {
        const emp = pick(employees);
        const start = faker.date.between({ from: daysAgo(120), to: daysAgo(-30) });
        const end = new Date(start);
        end.setDate(end.getDate() + faker.number.int({ min: 1, max: 7 }));
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        const status = pick(statuses);

        const approver = pick(employees);
        const rejector = pick(employees);
        const flagged = Math.random() < 0.15;

        leaves.push({
            employee: emp._id,
            type: pick(leaveTypes),
            startDate: start,
            endDate: end,
            reason: faker.lorem.sentence(),
            status,
            approvedBy: status === 'approved' ? approver._id : undefined,
            rejectedBy: status === 'rejected' ? rejector._id : undefined,
            rejectionReason: status === 'rejected' ? 'Insufficient notice / conflicting deadlines.' : undefined,
            reviewedAt: status === 'pending' ? undefined : faker.date.recent({ days: 40 }),
            days,
            flagged,
            flagReason: flagged ? 'Overlaps with critical milestone / suspicious pattern.' : undefined,
            flaggedBy: flagged ? approver._id : undefined
        });
    }
    await Leave.insertMany(leaves);
}

async function seedRecruitment({ employees, adminUser }) {
    const depts = ['Engineering', 'HR', 'Product', 'Design'];
    const positions = ['Frontend Engineer', 'Backend Engineer', 'QA Engineer', 'Product Designer', 'HR Specialist'];

    const recs = [];
    for (let i = 0; i < 6; i++) {
        const requestedBy = pick(employees);
        const dept = pick(depts);
        const position = pick(positions);
        const requestStatus = pick(['pending', 'approved', 'rejected']);

        const candidateCount = faker.number.int({ min: 3, max: 9 });
        const candidates = Array.from({ length: candidateCount }).map(() => ({
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            phone: faker.phone.number(),
            cv: { url: '/uploads/cv.pdf', name: 'cv.pdf' },
            status: pick(['applied', 'shortlisted', 'interviewed', 'selected', 'rejected']),
            notes: faker.lorem.sentence()
        }));

        const selected = candidates.findIndex(c => c.status === 'selected');
        const selectedCandidate = selected >= 0 ? new mongoose.Types.ObjectId() : undefined;

        recs.push({
            request: {
                requestedBy: requestedBy._id,
                department: dept,
                position,
                reason: faker.lorem.sentence(),
                urgency: pick(['low', 'medium', 'high']),
                status: requestStatus
            },
            jobPosting: {
                title: `${position} (${dept})`,
                description: faker.lorem.paragraph(),
                requirements: faker.helpers.arrayElements(
                    ['3+ years experience', 'Good communication', 'Team player', 'React', 'Node.js', 'Testing'],
                    { min: 2, max: 5 }
                ),
                postedOn: pick(['crm', 'linkedin', 'both']),
                linkedinUrl: Math.random() < 0.5 ? faker.internet.url() : undefined,
                status: pick(['draft', 'published', 'closed'])
            },
            candidates,
            meetings: [
                {
                    candidate: new mongoose.Types.ObjectId(),
                    scheduledAt: faker.date.soon({ days: 20 }),
                    jitsiRoomId: faker.string.uuid(),
                    notes: faker.lorem.sentence(),
                    status: pick(['scheduled', 'completed', 'cancelled'])
                }
            ],
            selectedCandidate,
            approvedBy: requestStatus === 'approved' ? adminUser?._id : undefined,
            hired: Math.random() < 0.2,
            hiredAt: Math.random() < 0.2 ? faker.date.recent({ days: 60 }) : undefined,
            offerLetter: Math.random() < 0.2 ? { url: '/uploads/offer.pdf', generatedAt: faker.date.recent({ days: 60 }) } : undefined
        });
    }

    await Recruitment.insertMany(recs);
}

async function seedQuestions({ projects, employees, clients }) {
    const questions = [];
    for (let i = 0; i < 18; i++) {
        const project = pick(projects);
        const askedBy = pick(employees);
        const answered = Math.random() < 0.55;
        const client = clients.find(c => c._id.toString() === project.client?.toString()) || pick(clients);
        questions.push({
            project: project._id,
            askedBy: askedBy._id,
            question: faker.lorem.sentence(),
            status: answered ? 'answered' : 'pending',
            answer: answered ? faker.lorem.sentences(2) : undefined,
            answeredBy: answered ? client._id : undefined,
            answeredAt: answered ? faker.date.recent({ days: 30 }) : undefined
        });
    }
    await Question.insertMany(questions);
}

function printCredentials({ basePassword }) {
    console.log('\nSeeded credentials (password is the same for all):');
    console.log(`- admin:    admin@devrolin.local / ${basePassword}`);
    console.log(`- pm:       pm@devrolin.local / ${basePassword}`);
    console.log(`- hr:       hr@devrolin.local / ${basePassword}`);
    console.log(`- employee: employee@devrolin.local / ${basePassword}`);
    console.log(`- client:   client@devrolin.local / ${basePassword}`);
    console.log('\nExtra seeded users: user1@devrolin.local ... user10@devrolin.local (Password123!)');
    console.log('Extra seeded clients: client1@devrolin.local ... client4@devrolin.local (Password123!)');
}

async function main() {
    await connect();
    console.log(`Connected to MongoDB: ${mongoose.connection.host}`);
    console.log(`Seed value: ${seedValue}`);

    if (shouldReset) {
        console.log('Resetting database...');
        await resetDatabase();
    }

    // If not resetting, avoid duplicating fixed emails by failing fast with a helpful msg.
    if (!shouldReset) {
        const existing = await User.findOne({ email: 'admin@devrolin.local' });
        if (existing) {
            console.log('Seed already appears to have been run. Re-run with --reset to wipe & reseed.');
            process.exit(0);
        }
    }

    const { basePassword, adminUser, pmUser, hrUser, employeeUser, clientUser } = await seedUsers();
    const { pmEmployee, hrEmployee, coreEmployee, employees } = await seedEmployees({ pmUser, hrUser, employeeUser });
    const { clients } = await seedClients({ clientUser, createdByEmployee: pmEmployee });
    const { projects, tasks } = await seedProjectsTasksDocsChats({ pmEmployee, employees, clients, adminUser });
    await seedAttendanceAndLeaves({ employees });
    await seedRecruitment({ employees, adminUser });
    await seedQuestions({ projects, employees, clients });

    printCredentials({ basePassword });
    console.log(`\nSeed summary:`);
    console.log(`- Users:       ${await User.countDocuments()}`);
    console.log(`- Employees:   ${await Employee.countDocuments()}`);
    console.log(`- Clients:     ${await Client.countDocuments()}`);
    console.log(`- Projects:    ${await Project.countDocuments()}`);
    console.log(`- Tasks:       ${await Task.countDocuments()}`);
    console.log(`- Documents:   ${await Document.countDocuments()}`);
    console.log(`- Chats:       ${await Chat.countDocuments()}`);
    console.log(`- Attendance:  ${await Attendance.countDocuments()}`);
    console.log(`- Leaves:      ${await Leave.countDocuments()}`);
    console.log(`- Recruitment: ${await Recruitment.countDocuments()}`);
    console.log(`- Questions:   ${await Question.countDocuments()}`);

    await mongoose.disconnect();
    console.log('\nDone.');
}

main().catch(async (err) => {
    console.error(err);
    try {
        await mongoose.disconnect();
    } catch { }
    process.exit(1);
});


