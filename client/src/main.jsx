import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PostProvider } from "./context/PostContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PostProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PostProvider>
  </BrowserRouter>,
);
