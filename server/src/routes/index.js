import express from 'express';
import healthRouter from './healthcheck.routes.js';
import userRouter from './user.routes.js';
import postRouter from './post.routes.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/users', userRouter);
router.use('/posts', postRouter);

export default router;
