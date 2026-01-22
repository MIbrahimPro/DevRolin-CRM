import express from 'express';
import Recruitment from '../models/Recruitment.mjs';
import Employee from '../models/Employee.mjs';
import User from '../models/User.mjs';
import { protect, authorize } from '../middlewares/auth.mjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @route   POST /api/recruitment/request
// @desc    Create hiring request (Manager)
router.post('/request', protect, authorize('pm'), async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    
    const recruitment = await Recruitment.create({
      request: {
        ...req.body,
        requestedBy: employee._id
      }
    });

    res.status(201).json(await Recruitment.findById(recruitment._id).populate('request.requestedBy'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/recruitment
// @desc    Get all recruitment records
router.get('/', protect, authorize('admin', 'hr'), async (req, res) => {
  try {
    const recruitments = await Recruitment.find()
      .populate('request.requestedBy selectedCandidate approvedBy')
      .sort({ createdAt: -1 });
    res.json(recruitments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/recruitment/:id
// @desc    Get recruitment by ID
router.get('/:id', protect, authorize('admin', 'hr', 'pm'), async (req, res) => {
  try {
    const recruitment = await Recruitment.findById(req.params.id)
      .populate('request.requestedBy selectedCandidate approvedBy');
    if (!recruitment) {
      return res.status(404).json({ message: 'Recruitment not found' });
    }
    res.json(recruitment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/recruitment/:id/job-posting
// @desc    Create job posting (HR)
router.post('/:id/job-posting', protect, authorize('hr'), async (req, res) => {
  try {
    const recruitment = await Recruitment.findById(req.params.id);
    if (!recruitment) {
      return res.status(404).json({ message: 'Recruitment not found' });
    }

    recruitment.jobPosting = {
      ...req.body,
      status: 'published'
    };
    await recruitment.save();

    res.json(recruitment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/recruitment/:id/candidates
// @desc    Add candidate (HR - for LinkedIn applicants)
router.post('/:id/candidates', protect, authorize('hr'), async (req, res) => {
  try {
    const recruitment = await Recruitment.findById(req.params.id);
    if (!recruitment) {
      return res.status(404).json({ message: 'Recruitment not found' });
    }

    recruitment.candidates.push(req.body);
    await recruitment.save();

    res.json(recruitment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/recruitment/:id/candidates/:candidateId/apply
// @desc    Apply for job (Public - for CRM job postings)
router.post('/:id/candidates/:candidateId/apply', async (req, res) => {
  try {
    const recruitment = await Recruitment.findById(req.params.id);
    if (!recruitment || recruitment.jobPosting.status !== 'published') {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // Create user account for candidate
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
      role: 'employee',
      isActive: false // Inactive until hired
    });

    // Add to candidates
    recruitment.candidates.push({
      ...req.body,
      status: 'applied'
    });
    await recruitment.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/recruitment/:id/meetings
// @desc    Schedule meeting (HR)
router.post('/:id/meetings', protect, authorize('hr'), async (req, res) => {
  try {
    const recruitment = await Recruitment.findById(req.params.id);
    if (!recruitment) {
      return res.status(404).json({ message: 'Recruitment not found' });
    }

    // Generate Jitsi room ID
    const roomId = `recruitment-${recruitment._id}-${Date.now()}`;

    recruitment.meetings.push({
      candidate: req.body.candidateId,
      scheduledAt: new Date(req.body.scheduledAt),
      jitsiRoomId: roomId,
      status: 'scheduled'
    });

    await recruitment.save();
    res.json(recruitment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/recruitment/:id/select
// @desc    Select candidate (HR)
router.put('/:id/select', protect, authorize('hr'), async (req, res) => {
  try {
    const recruitment = await Recruitment.findById(req.params.id);
    if (!recruitment) {
      return res.status(404).json({ message: 'Recruitment not found' });
    }

    recruitment.selectedCandidate = req.body.candidateId;
    await recruitment.save();

    res.json(recruitment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/recruitment/:id/approve
// @desc    Approve hiring (Admin)
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const recruitment = await Recruitment.findById(req.params.id).populate('selectedCandidate');
    if (!recruitment) {
      return res.status(404).json({ message: 'Recruitment not found' });
    }

    recruitment.approvedBy = req.user._id;
    recruitment.hired = true;
    recruitment.hiredAt = new Date();

    // Create employee record
    const candidate = recruitment.candidates.id(recruitment.selectedCandidate);
    const user = await User.findOne({ email: candidate.email });
    
    if (user) {
      user.isActive = true;
      await user.save();

      const employee = await Employee.create({
        user: user._id,
        firstName: candidate.name.split(' ')[0],
        lastName: candidate.name.split(' ').slice(1).join(' ') || '',
        email: candidate.email,
        phone: candidate.phone,
        department: recruitment.request.department,
        position: recruitment.request.position,
        employeeId: `EMP${Date.now()}`,
        hireDate: new Date()
      });

      recruitment.hired = true;
    }

    await recruitment.save();
    res.json(recruitment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


