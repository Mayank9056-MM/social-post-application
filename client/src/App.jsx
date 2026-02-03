import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import ProtectedRoute from "./routes/ProtectedRoutes";

/**
 * The main application component that renders the routes.
 * The routes are protected with the ProtectedRoute component,
 * which checks if the user is authenticated before rendering the Feed component.
 * The Register and Login components are publicly accessible.
 */
const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
