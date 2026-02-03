import { useEffect } from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Badge,
  Tabs,
  Tab,
  CircularProgress,
  Fab,
} from "@mui/material";
import {
  Search,
  NotificationsOutlined,
  Add,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { useState } from "react";

const Feed = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  const { user, fetchUser } = useAuth();
  const { posts, loading, hasMore, fetchPosts, deletePost, toggleLike, addComment } = usePosts();

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, activeTab, searchQuery]);

  const filterPosts = () => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.owner?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.owner?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tab filter
    switch (activeTab) {
      case 0: // All Posts
        break;
      case 1: // Most Liked
        filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
      case 2: // Most Commented
        filtered.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdatePost = async (postId, data) => {
    try {
      // You'll need to add updatePost to PostContext
      // For now, this is a placeholder
      console.log("Update post:", postId, data);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await toggleLike(postId);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async (postId, content) => {
    try {
      await addComment(postId, content);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target.documentElement;
    
    // Load more posts when user scrolls near bottom
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
      fetchPosts();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <Box sx={{ backgroundColor: "#f0f2f5", minHeight: "100vh", pb: 8 }}>
      {/* Top App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#333",
            }}
          >
            Social
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                backgroundColor: "#fff3cd",
                borderRadius: 20,
                px: 2,
                py: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: "#ff9800" }}>
                50
              </Typography>
              <Typography sx={{ fontSize: "1.2rem" }}>⭐</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "#e8f5e9",
                borderRadius: 20,
                px: 2,
                py: 0.5,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: "#4caf50" }}>
                ₹0.00
              </Typography>
            </Box>
            <IconButton>
              <Badge badgeContent={1} color="error">
                <NotificationsOutlined />
              </Badge>
            </IconButton>
            <Avatar
              src={user?.avatar}
              alt={user?.username}
              sx={{ width: 36, height: 36, cursor: "pointer" }}
            />
          </Box>
        </Toolbar>

        {/* Search Bar */}
        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search promotions, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#999" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
              },
            }}
          />
        </Box>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 2 }}>
        {/* Create Post Section */}
        <CreatePost />

        {/* Filter Tabs */}
        <Box
          sx={{
            mb: 2,
            backgroundColor: "#ffffff",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                minHeight: 48,
              },
              "& .Mui-selected": {
                color: "#1976d2",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#1976d2",
              },
            }}
          >
            <Tab label="All Posts" />
            <Tab label="Most Liked" />
            <Tab label="Most Commented" />
          </Tabs>
        </Box>

        {/* Posts List */}
        {posts.length === 0 && !loading ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              backgroundColor: "#ffffff",
              borderRadius: 2,
            }}
          >
            <Typography sx={{ color: "#999", fontSize: "1.1rem" }}>
              {searchQuery
                ? "No posts found matching your search"
                : "No posts yet. Be the first to post!"}
            </Typography>
          </Box>
        ) : (
          <>
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDeletePost}
                onUpdate={handleUpdatePost}
                onLike={handleLikePost}
                onAddComment={handleAddComment}
              />
            ))}
            
            {/* Loading indicator for infinite scroll */}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}
            
            {/* End of posts message */}
            {!hasMore && posts.length > 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography sx={{ color: "#999" }}>
                  You've reached the end!
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 80,
          right: 16,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <Add />
      </Fab>

      {/* Bottom Navigation */}
      <AppBar
        position="fixed"
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "#1976d2",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-around" }}>
          <Box sx={{ textAlign: "center", color: "#fff" }}>
            <IconButton sx={{ color: "#fff" }}>
              <Box sx={{ fontSize: "1.5rem" }}>🏠</Box>
            </IconButton>
          </Box>
          <Box sx={{ textAlign: "center", color: "#fff" }}>
            <IconButton sx={{ color: "#fff" }}>
              <Box sx={{ fontSize: "1.5rem" }}>📋</Box>
            </IconButton>
          </Box>
          <Box
            sx={{
              position: "relative",
              top: -20,
              backgroundColor: "#fff",
              borderRadius: "50%",
              p: 1,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1.8rem",
              }}
            >
              🌐
            </Box>
          </Box>
          <Box sx={{ textAlign: "center", color: "#fff" }}>
            <IconButton sx={{ color: "#fff" }}>
              <Badge badgeContent={2} color="error">
                <Box sx={{ fontSize: "1.5rem" }}>⭐</Box>
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Feed;