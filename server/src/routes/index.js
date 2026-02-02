import express from 'express'
import healthRouter from './healthcheck.routes.js'
import userRouter from './user.routes.js'

const router = express.Router();

router.use('/health', healthRouter);
router.use('/users', userRouter);

export default router;