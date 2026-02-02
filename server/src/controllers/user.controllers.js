import User from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import mongoose from 'mongoose';

// helper functions
const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(400, 'user not found please register');
        }

        const accessToken = user.generateAccessToken();

        return { accessToken };
    } catch (error) {
        throw new ApiError(
            500,
            'something went wrong while generating access token'
        );
    }
};

// main functions
export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, 'User with email or username already exists');
    }

    const user = await User.create({
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select('-password');

    if (!createdUser) {
        throw new ApiError(500, 'something went wrong while creating user');
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, 'User registered successfully')
        );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, 'Username or email is required');
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(404, 'User does not exist');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid user credentials');
    }

    const accessToken = await generateToken(user._id);

    const loggedInUser = await User.findById(user._id).select('-password');

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                token: accessToken,
            },
            'User logged in successfully'
        )
    );
});

export const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(
        new ApiResponse(200, user, 'User profile fetched successfully')
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .json(new ApiResponse(200, {}, 'User logged out successfully'));
});
