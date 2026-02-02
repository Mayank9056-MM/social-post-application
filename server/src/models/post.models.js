import mongoose from 'mongoose';

const commentShcema = new mongoose.Schema(
    {
        username: {
            type: String,
        },
        text: {
            type: String,
        },
    },
    { timestamps: true }
);

const postSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        image: {
            type: String,
            required: true,
            default: '',
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [commentShcema],
    },
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
