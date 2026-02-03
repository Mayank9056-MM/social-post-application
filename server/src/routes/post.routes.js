import express from 'express';
import {
    addComment,
    createPost,
    deletePost,
    getAllPosts,
    toggleLike,
    updatePost,
} from '../controllers/post.controllers.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', verifyAuth, upload.single('image'), createPost);
router.patch('/update/:postId', verifyAuth, updatePost);
router.delete('/delete/:postId', verifyAuth, deletePost);
router.get('/all-posts', verifyAuth, getAllPosts);
router.post('/add-comment/:postId', verifyAuth, addComment);
router.post('toggle-like', verifyAuth, toggleLike);

export default router;
