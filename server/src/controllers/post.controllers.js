import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import Post from '../models/post.models.js';
import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createPost = asyncHandler(async (req, res) => {
    let imageUrl = null;
    try {
        const imageLocalPath = req.file.path;

        // Upload image to cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath, {
            folder: 'posts',
        });
        imageUrl = cloudinaryResponse.secure_url;

        if (!imageUrl) {
            throw new ApiError(500, 'Error uploading image');
        }

        const newPost = await Post.create({
            owner: req.user._id,
            image: imageUrl,
        });

        if (!newPost) {
            throw new ApiError(500, 'Error creating post');
        }

        return res
            .status(201)
            .json(new ApiResponse(201, newPost, 'Post created successfully'));
    } catch (error) {
        if (imageUrl) {
            // Delete the uploaded image from Cloudinary if post creation fails
            await deleteFromCloudinary(imageUrl);
        }

        logger.error('Error in createPost:', error);
        throw new ApiError(500, 'Internal Server Error');
    }
});

export const updatePost = asyncHandler(async (req, res) => {
    // Implementation for updating a post
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
        throw new ApiError(400, 'Invalid post ID');
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to update this post');
    }

    let imageUrl = null;
    try {
        const imageLocalPath = req.file.path;

        if (!imageLocalPath) {
            throw new ApiError(404, 'Image local path not found');
        }

        await deleteFromCloudinary(post.image);

        // Upload image to cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath, {
            folder: 'posts',
        });
        imageUrl = cloudinaryResponse.secure_url;

        if (!imageUrl) {
            throw new ApiError(500, 'Error uploading image');
        }

        const updatedImage = await Post.findByIdAndUpdate(
            postId,
            {
                image: imageUrl,
            },
            { new: true }
        );

        if (!updatedImage) {
            throw new ApiError(500, 'Error updating post');
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { post: updatedImage },
                    'Post updated successfully'
                )
            );
    } catch (error) {
        if (imageUrl) {
            // Delete the uploaded image from Cloudinary if post creation fails
            await deleteFromCloudinary(imageUrl);
        }

        logger.error('Error in updatePost:', error);
        throw new ApiError(500, 'Internal Server Error');
    }
});

export const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
        throw new ApiError(400, 'Invalid post id');
    }

    const postToDelete = await Post.findById(postId);

    if (!postToDelete) {
        throw new ApiError(404, 'Post not found');
    }

    if (postToDelete.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to delete this post');
    }

    try {
        await deleteFromCloudinary(postToDelete.image);
    } catch (error) {
        logger.error('Error in deleting image', error);
        throw new ApiError(500, 'Error deleting image');
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
        throw new ApiError(500, 'Error deleting post');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { post: deletedPost },
                'Post deleted successfully'
            )
        );
});

export const getAllPosts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sort = req.query.sort || 'latest';

    const skip = (page - 1) * limit;

    let sortStage = {};

    if (sort === 'mostLiked') {
        sortStage = { likesCount: -1 };
    } else if (sort == 'mostCommented') {
        sortStage = { commentsCount: -1 };
    } else {
        sortStage = { createdAt: -1 };
    }

    const posts = await Post.aggregate([
        // add counts
        {
            $addFields: {
                likesCount: { $size: '$likes' },
                commentsCount: { $size: '$comments' },
            },
        },

        // sort
        {
            $sort: sortStage,
        },

        // pagination
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },

        // popluate owner
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner',
            },
        },
        {
            $unwind: '$owner',
        },

        // hiding password
        {
            $project: {
                'owner.password': 0,
            },
        },
    ]);

    const totalPosts = await Post.countDocuments();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                page,
                limit,
                totalPosts,
                totalPages: Math.ceil(totalPosts / limit),
                posts,
            },
            'Posts fetched successfully'
        )
    );
});

export const addComment = asyncHandler(async (req, res) => {
    // Implementation for adding a comment to a post
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
        throw new ApiError(400, 'Invalid post id');
    }

    const post = await Post.findById(postId).populate('owner, username');

    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    const { content } = req.body;

    if (!content?.trim() || content.length > 250) {
        throw new ApiError(404, 'Invalid comment');
    }

    post.comments.push({ username: req.user.username, text: content });

    await post.save({ validateBeforeSave: false });

    return res
        .status(201)
        .json(new ApiResponse(201, post, 'Comment added successfully'));
});

export const toggleLike = asyncHandler(async (req, res) => {
    // Implementation for adding a like to a post
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
        throw new ApiError(400, 'Invalid post id');
    }

    const post = await Post.findById(postId).populate('owner username');

    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    if (post.likes.includes(req.user._id)) {
        // unlike video
        post.likes.filter((like) => like !== req.user._id);

        await post.save({ validateBeforeSave: false });

        return res
            .status(201)
            .json(new ApiResponse(201, post, 'Like removed successfully'));
    }

    post.likes.push(req.user._id);

    await post.save({ validateBeforeSave: false });

    return res
        .status(201)
        .json(new ApiResponse(201, post, 'Like added successfully'));
});
