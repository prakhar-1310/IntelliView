import express from 'express';
import { getPlatformStats, getAllPlatformStats, saveUsernames, getUsernames } from '../controllers/codefolioController.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// Get stats for a specific platform
router.get('/platform', getPlatformStats);

// Get stats for all platforms
router.post('/all', getAllPlatformStats);

// Save CodeFolio usernames
router.post('/usernames', requireAuth(), saveUsernames);

// Get CodeFolio usernames
router.get('/usernames', requireAuth(), getUsernames);

export default router;
