import express from 'express';
import Attendance from '../models/Attendance.mjs';
import { protect, authorize } from '../middlewares/auth.mjs';

const router = express.Router();

// @route   POST /api/attendance/checkin
// @desc    Check in (Employee)
router.post('/checkin', protect, authorize('employee', 'pm', 'hr'), async (req, res) => {
    try {
        const Employee = (await import('../models/Employee.mjs')).default;
        const employee = await Employee.findOne({ user: req.user._id });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in today
        const existing = await Attendance.findOne({
            employee: employee._id,
            date: today
        });

        if (existing) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const attendance = await Attendance.create({
            employee: employee._id,
            date: today,
            checkIn: {
                time: new Date(),
                location: req.body.location || 'remote'
            },
            status: 'present'
        });

        res.status(201).json(await Attendance.findById(attendance._id).populate('employee'));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/attendance
// @desc    Get attendance records
router.get('/', protect, async (req, res) => {
    try {
        const Employee = (await import('../models/Employee.mjs')).default;
        const employee = await Employee.findOne({ user: req.user._id });

        let query = {};
        if (req.user.role === 'employee') {
            query.employee = employee._id;
        } else if (req.query.employee) {
            query.employee = req.query.employee;
        }

        if (req.query.startDate && req.query.endDate) {
            query.date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        const attendance = await Attendance.find(query)
            .populate('employee')
            .sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/attendance/today
// @desc    Get today's attendance status
router.get('/today', protect, async (req, res) => {
    try {
        const Employee = (await import('../models/Employee.mjs')).default;
        const employee = await Employee.findOne({ user: req.user._id });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            employee: employee._id,
            date: today
        });

        res.json({ checkedIn: !!attendance, attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;


