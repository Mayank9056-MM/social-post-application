/* eslint-disable no-useless-catch */
import { createContext, useContext, useState } from "react";
import api from "../api/axoisInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const register = async (data) => {
    try {
      const res = await api.post("/users/register", data);
      return res.data.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (data) => {
    try {
      const res = await api.post("/users/login", data);
      console.log(res.data.data);
      setUser(res.data.data.user);
      localStorage.setItem("token", res.data.data.accessToken);
      setToken(res.data.data.accessToken);
      return res.data.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data.data);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    login,
    register,
    logout,
    fetchUser,
    user,
    setUser,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
