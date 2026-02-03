import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  PhotoCamera,
  EmojiEmotions,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createPost } = usePosts();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await createPost(formData);

      // Reset form
      setContent("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ fontWeight: 700, fontSize: "1.5rem", mb: 1 }}>
          Create Post
        </Box>
      </Box>

      {/* Input Area */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
        <Avatar
          src={user?.avatar}
          alt={user?.username}
          sx={{ width: 40, height: 40 }}
        />
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="standard"
          disabled={loading}
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            "& .MuiInputBase-input": {
              fontSize: "1rem",
              color: "#333",
              "&::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      {/* Image Preview */}
      {imagePreview && (
        <Box
          sx={{
            position: "relative",
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.8)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      )}

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #e0e0e0",
          pt: 1.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            component="label"
            sx={{ color: "#1976d2" }}
            disabled={loading}
          >
            <PhotoCamera />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </IconButton>
          <IconButton sx={{ color: "#1976d2" }} disabled={loading}>
            <EmojiEmotions />
          </IconButton>
          <IconButton sx={{ color: "#1976d2" }} disabled={loading}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="text"
            sx={{
              color: "#1976d2",
              textTransform: "none",
              fontWeight: 600,
            }}
            disabled={loading}
          >
            Promote
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || (!content.trim() && !image)}
            sx={{
              backgroundColor: "#d0d0d0",
              color: "#666",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#b0b0b0",
              },
              "&:disabled": {
                backgroundColor: "#e0e0e0",
                color: "#999",
              },
            }}
          >
            {loading ? <CircularProgress size={20} /> : "Post"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePost;