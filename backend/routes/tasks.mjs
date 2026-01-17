import express from 'express';
import Task from '../models/Task.mjs';
import Project from '../models/Project.mjs';
import { protect, authorize } from '../middlewares/auth.mjs';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks
router.get('/', protect, async (req, res) => {
  try {
    const Employee = (await import('../models/Employee.mjs')).default;
    const employee = await Employee.findOne({ user: req.user._id });
    
    let query = {};
    if (req.user.role === 'employee') {
      query.assignedTo = employee._id;
    } else if (req.user.role === 'pm') {
      query.createdBy = employee._id;
    }

    if (req.query.project) {
      query.project = req.query.project;
    }

    const tasks = await Task.find(query)
      .populate('project assignedTo createdBy documents reviewedBy')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project assignedTo createdBy documents reviewedBy');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create task
router.post('/', protect, authorize('pm'), async (req, res) => {
  try {
    const Employee = (await import('../models/Employee.mjs')).default;
    const employee = await Employee.findOne({ user: req.user._id });
    
    const taskData = {
      ...req.body,
      createdBy: employee._id
    };

    const task = await Task.create(taskData);
    res.status(201).json(await Task.findById(task._id).populate('project assignedTo createdBy'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
router.put('/:id', protect, async (req, res) => {
  try {
    const Employee = (await import('../models/Employee.mjs')).default;
    const employee = await Employee.findOne({ user: req.user._id });
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Employee can only update their own assigned tasks
    if (req.user.role === 'employee') {
      if (!task.assignedTo.some(id => id.toString() === employee._id.toString())) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      // Employees can update progress, milestones, and status to in-progress or review
      const allowedUpdates = ['progress', 'milestones', 'status', 'documents'];
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          task[key] = req.body[key];
        }
      });

      if (req.body.status === 'review') {
        task.submittedAt = new Date();
      }
    } else {
      // PM and Admin can update everything
      Object.assign(task, req.body);
    }

    await task.save();
    res.json(await Task.findById(task._id).populate('project assignedTo createdBy'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id/submit
// @desc    Submit task for review
router.put('/:id/submit', protect, authorize('employee'), async (req, res) => {
  try {
    const Employee = (await import('../models/Employee.mjs')).default;
    const employee = await Employee.findOne({ user: req.user._id });
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.assignedTo.some(id => id.toString() === employee._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task.status = 'review';
    task.submittedAt = new Date();
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id/review
// @desc    Review task (PM)
router.put('/:id/review', protect, authorize('pm'), async (req, res) => {
  try {
    const Employee = (await import('../models/Employee.mjs')).default;
    const employee = await Employee.findOne({ user: req.user._id });
    const { action, feedback } = req.body; // action: 'accept' or 'reject'

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (action === 'accept') {
      task.status = 'completed';
      task.reviewedBy = employee._id;
      task.reviewedAt = new Date();
    } else if (action === 'reject') {
      task.status = 'in-progress';
      task.reviewedBy = employee._id;
      task.reviewedAt = new Date();
      if (feedback) {
        task.feedback.push({
          message: feedback,
          givenBy: employee._id
        });
      }
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

