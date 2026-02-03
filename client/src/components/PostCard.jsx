import { useState } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  MoreVert,
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  Share,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import CommentDialog from "./CommentDialog";

const PostCard = ({ post, onDelete, onUpdate, onLike, onAddComment }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const { user } = useAuth();

  // Check if current user has liked the post
  const isLiked = post.likes?.some((like) => like._id === user?._id || like === user?._id);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  const isOwnPost = user?._id === post.owner?._id;
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async () => {
    try {
      if (onLike) {
        await onLike(post._id);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    try {
      if (onUpdate) {
        await onUpdate(post._id, { content: editContent });
      }
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (onDelete) {
        await onDelete(post._id);
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options).replace(",", " •");
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 1.5, flex: 1 }}>
            <Avatar
              src={post.owner?.avatar}
              alt={post.owner?.username}
              sx={{ width: 48, height: 48 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {post.owner?.fullName || post.owner?.username}
              </Typography>
              <Typography sx={{ color: "#666", fontSize: "0.875rem" }}>
                @{post.owner?.username}
              </Typography>
              <Typography sx={{ color: "#999", fontSize: "0.8rem", mt: 0.5 }}>
                {formatDate(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
            {!isOwnPost && (
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 20,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Follow
              </Button>
            )}
            {isOwnPost && (
              <IconButton onClick={handleMenuClick} size="small">
                <MoreVert />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Content */}
        {post.content && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
              {post.content}
            </Typography>
          </Box>
        )}

        {/* Image */}
        {post.image && (
          <Box>
            <img
              src={post.image}
              alt="Post"
              style={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        {/* Actions */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-around",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
            }}
            onClick={handleLike}
          >
            <IconButton size="small" sx={{ color: isLiked ? "#f50057" : "#666" }}>
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography sx={{ fontSize: "0.875rem", color: "#666" }}>
              {likesCount}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
            }}
            onClick={() => setCommentDialogOpen(true)}
          >
            <IconButton size="small" sx={{ color: "#666" }}>
              <ChatBubbleOutline />
            </IconButton>
            <Typography sx={{ fontSize: "0.875rem", color: "#666" }}>
              {commentsCount}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton size="small" sx={{ color: "#666" }}>
              <Share />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Menu for Edit/Delete */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1, fontSize: "1.2rem" }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { setDeleteDialogOpen(true); handleMenuClose(); }}>
          <Delete sx={{ mr: 1, fontSize: "1.2rem", color: "#f44336" }} />
          <Typography sx={{ color: "#f44336" }}>Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!editContent.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comment Dialog */}
      <CommentDialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        post={post}
        onAddComment={onAddComment}
      />
    </>
  );
};

export default PostCard;