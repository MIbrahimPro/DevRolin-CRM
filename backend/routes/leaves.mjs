import express from 'express';
import Leave from '../models/Leave.mjs';
import Employee from '../models/Employee.mjs';
import { protect, authorize } from '../middlewares/auth.mjs';

const router = express.Router();

// @route   POST /api/leaves
// @desc    Apply for leave
router.post('/', protect, authorize('employee', 'pm', 'hr'), async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    
    const { type, startDate, endDate, reason } = req.body;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Check leave balance
    if (employee.leaveBalance < days) {
      return res.status(400).json({ message: 'Insufficient leave balance' });
    }

    const leave = await Leave.create({
      employee: employee._id,
      type,
      startDate: start,
      endDate: end,
      reason,
      days
    });

    res.status(201).json(await Leave.findById(leave._id).populate('employee'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/leaves
// @desc    Get leaves
router.get('/', protect, async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    
    let query = {};
    if (req.user.role === 'employee') {
      query.employee = employee._id;
    } else if (req.query.employee) {
      query.employee = req.query.employee;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const leaves = await Leave.find(query)
      .populate('employee approvedBy rejectedBy')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/leaves/:id/approve
// @desc    Approve leave (PM)
router.put('/:id/approve', protect, authorize('pm'), async (req, res) => {
  try {
    const pmEmployee = await Employee.findOne({ user: req.user._id });
    const leave = await Leave.findById(req.params.id).populate('employee');
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // Check if PM manages this employee
    const employee = await Employee.findById(leave.employee._id);
    if (employee.manager?.toString() !== pmEmployee._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to approve this leave' });
    }

    leave.status = 'approved';
    leave.approvedBy = pmEmployee._id;
    leave.reviewedAt = new Date();

    // Update leave balance
    employee.leaveBalance -= leave.days;
    await employee.save();

    await leave.save();
    res.json(await Leave.findById(leave._id).populate('employee approvedBy'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/leaves/:id/reject
// @desc    Reject leave (PM)
router.put('/:id/reject', protect, authorize('pm'), async (req, res) => {
  try {
    const pmEmployee = await Employee.findOne({ user: req.user._id });
    const leave = await Leave.findById(req.params.id).populate('employee');
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    const employee = await Employee.findById(leave.employee._id);
    if (employee.manager?.toString() !== pmEmployee._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this leave' });
    }

    leave.status = 'rejected';
    leave.rejectedBy = pmEmployee._id;
    leave.rejectionReason = req.body.reason;
    leave.reviewedAt = new Date();

    await leave.save();
    res.json(await Leave.findById(leave._id).populate('employee rejectedBy'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/leaves/:id/flag
// @desc    Flag leave for review (HR)
router.put('/:id/flag', protect, authorize('hr'), async (req, res) => {
  try {
    const hrEmployee = await Employee.findOne({ user: req.user._id });
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    leave.flagged = true;
    leave.flagReason = req.body.reason;
    leave.flaggedBy = hrEmployee._id;

    await leave.save();
    res.json(await Leave.findById(leave._id).populate('employee flaggedBy'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/leaves/:id/override
// @desc    Override leave decision (Admin)
router.put('/:id/override', protect, authorize('admin'), async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const leave = await Leave.findById(req.params.id).populate('employee');
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (action === 'approve') {
      leave.status = 'approved';
      leave.approvedBy = req.user._id;
      const employee = await Employee.findById(leave.employee._id);
      if (leave.status !== 'approved') {
        employee.leaveBalance -= leave.days;
        await employee.save();
      }
    } else {
      leave.status = 'rejected';
      leave.rejectedBy = req.user._id;
      leave.rejectionReason = req.body.reason;
    }

    leave.reviewedAt = new Date();
    await leave.save();
    res.json(await Leave.findById(leave._id).populate('employee'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


