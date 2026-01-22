import express from 'express';
import Document from '../models/Document.mjs';
import { protect, authorize } from '../middlewares/auth.mjs';

const router = express.Router();

// @route   GET /api/documents
// @desc    Get documents
router.get('/', protect, async (req, res) => {
    try {
        let query = {};

        if (req.query.project) {
            query.project = req.query.project;
        }
        if (req.query.task) {
            query.task = req.query.task;
        }

        const documents = await Document.find(query)
            .populate('createdBy project task sharedWith.user');
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/documents/:id
// @desc    Get document by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('createdBy project task sharedWith.user');

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check access
        const Employee = (await import('../models/Employee.mjs')).default;
        const employee = await Employee.findOne({ user: req.user._id });

        const hasAccess =
            document.createdBy._id.toString() === employee?._id?.toString() ||
            (document.project && document.project.team?.some(t => t._id.toString() === employee?._id?.toString())) ||
            document.sharedWith.some(s => s.user._id.toString() === req.user._id.toString());

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to view this document' });
        }

        res.json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/documents
// @desc    Create document
router.post('/', protect, authorize('pm', 'employee'), async (req, res) => {
    try {
        const Employee = (await import('../models/Employee.mjs')).default;
        const employee = await Employee.findOne({ user: req.user._id });

        const documentData = {
            ...req.body,
            createdBy: employee._id
        };

        // Initialize with first version
        documentData.versions = [{
            content: req.body.content || {},
            versionNumber: 1,
            createdBy: employee._id
        }];

        const document = await Document.create(documentData);
        res.status(201).json(await Document.findById(document._id).populate('createdBy project'));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/documents/:id
// @desc    Update document
router.put('/:id', protect, async (req, res) => {
    try {
        const Employee = (await import('../models/Employee.mjs')).default;
        const employee = await Employee.findOne({ user: req.user._id });
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check if user can edit (creator, team member, or live shared)
        const canEdit =
            document.createdBy.toString() === employee._id.toString() ||
            document.isLiveShared && document.liveEditors.some(e => e.user.toString() === req.user._id.toString());

        if (!canEdit && document.isLiveShared) {
            return res.status(403).json({ message: 'Document is live shared, only live editors can edit' });
        }

        // Create new version if content changed
        if (req.body.content) {
            const newVersion = {
                content: req.body.content,
                versionNumber: document.versions.length + 1,
                createdBy: employee._id
            };
            document.versions.push(newVersion);
            document.content = req.body.content;

            // Update static shared versions
            document.sharedWith.forEach(share => {
                if (share.mode === 'static') {
                    share.version = newVersion._id;
                }
            });
        }

        if (req.body.title) {
            document.title = req.body.title;
        }

        await document.save();
        res.json(await Document.findById(document._id).populate('createdBy project'));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/documents/:id/share
// @desc    Share document (live or static)
router.post('/:id/share', protect, authorize('pm'), async (req, res) => {
    try {
        const { userId, mode } = req.body; // mode: 'live' or 'static'
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check if already shared
        const existingShare = document.sharedWith.find(s => s.user.toString() === userId);

        if (mode === 'live') {
            document.isLiveShared = true;
            if (!existingShare) {
                document.sharedWith.push({
                    user: userId,
                    mode: 'live'
                });
                document.liveEditors.push({
                    user: userId
                });
            } else {
                existingShare.mode = 'live';
                if (!document.liveEditors.some(e => e.user.toString() === userId)) {
                    document.liveEditors.push({ user: userId });
                }
            }
        } else {
            // Static share - get current version
            const currentVersion = document.versions[document.versions.length - 1];
            if (!existingShare) {
                document.sharedWith.push({
                    user: userId,
                    mode: 'static',
                    version: currentVersion._id
                });
            } else {
                existingShare.mode = 'static';
                existingShare.version = currentVersion._id;
                existingShare.sharedAt = new Date();
            }
        }

        await document.save();
        res.json(await Document.findById(document._id).populate('sharedWith.user'));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/documents/:id/versions
// @desc    Get document versions
router.get('/:id/versions', protect, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document.versions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;


