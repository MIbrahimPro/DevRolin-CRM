import express from 'express';
import Employee from '../models/Employee.mjs';
import User from '../models/User.mjs';
import { protect, authorize } from '../middlewares/auth.mjs';

const router = express.Router();

// @route   GET /api/employees
// @desc    Get all employees
router.get('/', protect, async (req, res) => {
    try {
        const employees = await Employee.find({ terminated: false })
            .populate('user manager')
            .sort({ createdAt: -1 });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('user manager documents');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/employees
// @desc    Create employee (after recruitment)
router.post('/', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const employeeData = req.body;
        const employee = await Employee.create(employeeData);
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
router.put('/:id', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user manager');

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/employees/:id
// @desc    Terminate employee
router.delete('/:id', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const { reason } = req.body;
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.terminated = true;
        employee.terminationDate = new Date();
        employee.terminationReason = reason;
        await employee.save();

        // Deactivate user account
        await User.findByIdAndUpdate(employee.user, { isActive: false });

        res.json({ message: 'Employee terminated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/employees/:id/tasks
// @desc    Get employee tasks (HR can view)
router.get('/:id/tasks', protect, authorize('admin', 'hr', 'pm'), async (req, res) => {
    try {
        const Task = (await import('../models/Task.mjs')).default;
        const tasks = await Task.find({ assignedTo: req.params.id })
            .populate('project createdBy')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/employees/:id/statistics
// @desc    Get employee statistics
router.get('/:id/statistics', protect, authorize('admin', 'hr', 'pm'), async (req, res) => {
    try {
        const Task = (await import('../models/Task.mjs')).default;
        const Attendance = (await import('../models/Attendance.mjs')).default;
        const Leave = (await import('../models/Leave.mjs')).default;

        const tasks = await Task.find({ assignedTo: req.params.id });
        const attendance = await Attendance.find({ employee: req.params.id });
        const leaves = await Leave.find({ employee: req.params.id });

        const stats = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'completed').length,
            inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
            totalAttendance: attendance.length,
            presentDays: attendance.filter(a => a.status === 'present').length,
            totalLeaves: leaves.filter(l => l.status === 'approved').length,
            pendingLeaves: leaves.filter(l => l.status === 'pending').length
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/employees/:id/performance
// @desc    Add performance review
router.post('/:id/performance', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const { reviewPeriod, rating, feedback } = req.body;
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const employeeModel = await Employee.findOne({ user: req.user._id });
        employee.performance.push({
            reviewPeriod,
            rating,
            feedback,
            reviewedBy: employeeModel._id
        });

        await employee.save();
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;


