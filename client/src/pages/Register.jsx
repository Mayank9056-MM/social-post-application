import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
  EmailOutlined,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      // Navigate to login page after successful registration
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          {/* Logo/Header Section */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                }}
              >
                S
              </Typography>
            </Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#333",
                mb: 1,
              }}
            >
              Social
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#666",
              }}
            >
              Create your account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: "#667eea" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: "#667eea" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#667eea" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 2,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5568d3 0%, #6a4190 100%)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                },
                "&:disabled": {
                  background: "#cccccc",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#ffffff" }} />
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Login Link */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{" "}
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#667eea",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign In
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" sx={{ color: "#ffffff" }}>
            © 2026 Social. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;