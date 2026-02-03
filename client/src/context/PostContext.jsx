import { createContext, useContext, useState } from "react";
import API from "../api/axoisInstance";

const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // fetch posts
  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await API.get(`/posts/all-posts?page=${page}&limit=${limit}`);

      const fetchedPosts = res.data.data.posts;

      setPosts((prev) => [...prev, ...fetchedPosts]);

      // pagination check
      if (fetchedPosts.length < limit) {
        setHasMore(false);
      }

      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // create post
  const createPost = async (formData) => {
    try {
      const res = await API.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosts((prev) => [res.data.data, ...prev]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // delete post
  const deletePost = async (postId) => {
    try {
      await API.delete(`/posts/delete/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Toggle like
  const toggleLike = async (postId) => {
    try {
      const res = await API.patch(`/posts/toggle-like/${postId}`);

      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data.data : post)),
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // add comment
  const addComment = async (postId, content) => {
    try {
      const res = await API.post(`/posts/add-comment/${postId}`, { content });

      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data.data : post)),
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        hasMore,
        fetchPosts,
        createPost,
        deletePost,
        toggleLike,
        addComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within PostProvider");
  }
  return context;
};
