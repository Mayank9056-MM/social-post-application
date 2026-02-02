import express from 'express';
import {
    getUserProfile,
    loginUser,
    logoutUser,
    registerUser,
} from '../controllers/user.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyAuth, logoutUser);
router.get('/profile', verifyAuth, getUserProfile);

export default router;
