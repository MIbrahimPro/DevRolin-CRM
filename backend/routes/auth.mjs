import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';
import Employee from '../models/Employee.mjs';
import Client from '../models/Client.mjs';
import { protect, authorize } from '../middlewares/auth.mjs';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.password && !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);

        // Get additional user info based on role
        let profile = null;
        if (user.role === 'employee' || user.role === 'pm' || user.role === 'hr') {
            profile = await Employee.findOne({ user: user._id }).populate('user');
        } else if (user.role === 'client') {
            profile = await Client.findOne({ user: user._id }).populate('user');
        }

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                preferences: user.preferences
            },
            profile
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/create-client
// @desc    Create client credentials (PM only)
router.post('/create-client', protect, authorize('pm'), async (req, res) => {
    try {
        const { email, companyName, contactName, phone, projectId } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);

        // Create user
        user = await User.create({
            email,
            password: tempPassword,
            role: 'client'
        });

        // Create client
        const employee = await Employee.findOne({ user: req.user._id });
        const client = await Client.create({
            user: user._id,
            companyName,
            contactName,
            email,
            phone,
            createdBy: employee._id,
            projects: projectId ? [projectId] : []
        });

        res.status(201).json({
            message: 'Client credentials created successfully',
            credentials: {
                email,
                password: tempPassword // In production, send via email
            },
            client
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', protect, async (req, res) => {
    try {
        let profile = null;
        if (req.user.role === 'employee' || req.user.role === 'pm' || req.user.role === 'hr') {
            profile = await Employee.findOne({ user: req.user._id }).populate('user manager');
        } else if (req.user.role === 'client') {
            profile = await Client.findOne({ user: req.user._id })
                .populate('user projects createdBy');
        }

        res.json({
            user: req.user,
            profile
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/auth/preferences
// @desc    Update user preferences
router.put('/preferences', protect, async (req, res) => {
    try {
        const { theme, notifications } = req.body;

        req.user.preferences = {
            theme: theme || req.user.preferences.theme,
            notifications: notifications !== undefined ? notifications : req.user.preferences.notifications
        };

        await req.user.save();

        res.json({ preferences: req.user.preferences });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

