import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  IconButton,
  Avatar,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Send, Close } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const CommentDialog = ({ open, onClose, post, onAddComment }) => {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  console.log(post.comments,"post")

  const comments = post.comments || [];

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      if (onAddComment) {
        await onAddComment(post._id, comment);
      }
      setComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Comments
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        {/* Add Comment Section */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1.5,
            backgroundColor: "#f9f9f9",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            sx={{ width: 36, height: 36 }}
          />
          <Box
            sx={{ flex: 1, display: "flex", gap: 1, alignItems: "flex-start" }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={submitting}
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
            <IconButton
              onClick={handleSubmitComment}
              disabled={!comment.trim() || submitting}
              sx={{
                color: "#1976d2",
                "&:disabled": {
                  color: "#ccc",
                },
              }}
            >
              {submitting ? <CircularProgress size={24} /> : <Send />}
            </IconButton>
          </Box>
        </Box>

        {/* Comments List */}
        <Box sx={{ p: 2 }}>
          {comments.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ color: "#999" }}>
                No comments yet. Be the first to comment!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {comments.map((commentItem) => (
                <Box key={commentItem._id} sx={{ display: "flex", gap: 1.5 }}>
                  <Avatar
                    src={commentItem.owner?.avatar}
                    alt={commentItem?.username}
                    sx={{ width: 36, height: 36 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        backgroundColor: "#f0f2f5",
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          mb: 0.5,
                        }}
                      >
                        {
                          commentItem?.username}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          lineHeight: 1.4,
                          wordBreak: "break-word",
                        }}
                      >
                        {commentItem?.text}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "#666",
                        mt: 0.5,
                        ml: 1.5,
                      }}
                    >
                      {formatDate(commentItem.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
