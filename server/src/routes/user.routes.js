import express from 'express';
import {
    getUserProfile,
    loginUser,
    logoutUser,
    registerUser,
} from '../controllers/user.controllers.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyAuth, logoutUser);
router.get('/profile', verifyAuth, getUserProfile);

export default router;
