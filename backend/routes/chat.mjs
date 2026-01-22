import express from 'express';
import Chat from '../models/Chat.mjs';
import { protect } from '../middlewares/auth.mjs';

const router = express.Router();

// @route   GET /api/chat/:projectId
// @desc    Get project chat
router.get('/:projectId', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ project: req.params.projectId })
      .populate('messages.sender participants');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/chat/:projectId/messages
// @desc    Send message
router.post('/:projectId/messages', protect, async (req, res) => {
  try {
    const Employee = (await import('../models/Employee.mjs')).default;
    const employee = await Employee.findOne({ user: req.user._id });
    
    let chat = await Chat.findOne({ project: req.params.projectId });

    if (!chat) {
      chat = await Chat.create({
        project: req.params.projectId,
        participants: [employee._id]
      });
    }

    chat.messages.push({
      sender: employee._id,
      content: req.body.content,
      attachments: req.body.attachments || []
    });

    if (!chat.participants.some(p => p.toString() === employee._id.toString())) {
      chat.participants.push(employee._id);
    }

    await chat.save();

    res.status(201).json(await Chat.findById(chat._id).populate('messages.sender'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


