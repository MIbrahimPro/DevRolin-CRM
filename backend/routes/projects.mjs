import express from 'express';
import Project from '../models/Project.mjs';
import Task from '../models/Task.mjs';
import Document from '../models/Document.mjs';
import Chat from '../models/Chat.mjs';
import Question from '../models/Question.mjs';
import { protect, authorize } from '../middlewares/auth.mjs';

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', protect, async (req, res) => {
    try {
        const Employee = (await import('../models/Employee.mjs')).default;
        const employee = await Employee.findOne({ user: req.user._id });

        let query = {};
        if (req.user.role === 'pm') {
            query.pm = employee._id;
        } else if (req.user.role === 'employee') {
            query.team = employee._id;
        }

        const projects = await Project.find(query)
            .populate('pm team client requirements documents approvedBy')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('pm team client requirements documents chat approvedBy');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/projects
// @desc    Create project (PM)
router.post('/', protect, authorize('pm'), async (req, res) => {
    try {
        const Employee = (await import('../models/Employee.mjs')).default;
        const employee = await Employee.findOne({ user: req.user._id });

        const projectData = {
            ...req.body,
            pm: employee._id,
            status: 'pending'
        };

        const project = await Project.create(projectData);

        // Create chat for team
        const chat = await Chat.create({
            project: project._id,
            participants: [employee._id]
        });

        project.chat = chat._id;
        await project.save();

        res.status(201).json(await Project.findById(project._id).populate('pm chat'));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/projects/:id/approve
// @desc    Approve project (Admin)
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.status = 'approved';
        project.approvedBy = req.user._id;
        project.approvedAt = new Date();
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project
router.put('/:id', protect, authorize('pm', 'admin'), async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('pm team client');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/projects/:id/client
// @desc    Add client to project
router.post('/:id/client', protect, authorize('pm'), async (req, res) => {
    try {
        const Client = (await import('../models/Client.mjs')).default;
        const { clientId } = req.body;

        const project = await Project.findById(req.params.id);
        const client = await Client.findById(clientId);

        if (!project || !client) {
            return res.status(404).json({ message: 'Project or client not found' });
        }

        project.client = clientId;
        await project.save();

        if (!client.projects.includes(project._id)) {
            client.projects.push(project._id);
            await client.save();
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/projects/:id/questions
// @desc    Ask question to client
router.post('/:id/questions', protect, authorize('pm'), async (req, res) => {
    try {
        const Employee = (await import('../models/Employee.mjs')).default;
        const employee = await Employee.findOne({ user: req.user._id });

        const question = await Question.create({
            project: req.params.id,
            askedBy: employee._id,
            question: req.body.question
        });

        res.status(201).json(await Question.findById(question._id).populate('askedBy'));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/projects/:id/questions/:questionId/answer
// @desc    Answer question (Client)
router.put('/:id/questions/:questionId/answer', protect, authorize('client'), async (req, res) => {
    try {
        const Client = (await import('../models/Client.mjs')).default;
        const client = await Client.findOne({ user: req.user._id });

        const question = await Question.findById(req.params.questionId);
        if (!question || question.project.toString() !== req.params.id) {
            return res.status(404).json({ message: 'Question not found' });
        }

        question.answer = req.body.answer;
        question.status = 'answered';
        question.answeredBy = client._id;
        question.answeredAt = new Date();
        await question.save();

        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/projects/:id/questions
// @desc    Get project questions
router.get('/:id/questions', protect, async (req, res) => {
    try {
        const questions = await Question.find({ project: req.params.id })
            .populate('askedBy answeredBy')
            .sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;


