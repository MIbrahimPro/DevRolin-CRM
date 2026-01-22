import express from 'express';
import jwt from 'jsonwebtoken';
import { protect } from '../middlewares/auth.mjs';

const router = express.Router();

// @route   POST /api/meetings/jitsi-token
// @desc    Generate Jitsi JWT token
router.post('/jitsi-token', protect, async (req, res) => {
  try {
    const { roomId, isModerator = false } = req.body;

    // Jitsi JWT token generation
    const appId = process.env.JITSI_APP_ID || 'devrolin-app';
    const kid = process.env.JITSI_KID || 'devrolin-kid';
    const secret = process.env.JITSI_SECRET || 'dev-secret';

    const payload = {
      iss: appId,
      aud: 'jitsi',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      nbf: Math.floor(Date.now() / 1000),
      room: roomId,
      sub: process.env.JITSI_DOMAIN || 'meet.jit.si',
      context: {
        user: {
          id: req.user._id.toString(),
          name: req.user.email,
          moderator: isModerator
        }
      }
    };

    const token = jwt.sign(payload, secret, { 
      algorithm: 'HS256',
      header: { kid }
    });

    res.json({ 
      token,
      roomId,
      domain: process.env.JITSI_DOMAIN || 'meet.jit.si'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


