/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext, useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useApi } from "./ApiProvider";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [isAuthenticated, setisAuthenticated] = useState(
    JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );
  const api = useApi();

  const login = useGoogleLogin({
    onSuccess: (res) => {
      authenticateUser(res);
    },
    onFailure: (res) => {
      console.log("Login Failed", res);
    },
    onError: (res) => {
      console.log("Login Error", res);
    },
  });

  const authenticateUser = async (access_token) => {
    try {
      const response = await api.post("/auth/google", {
        access_token,
      });
      const data = response.body;

      if (data && data.user) {
        setUser(data.user);
        setisAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAuthenticated", true);
      } else {
        // Handle the case where data is not as expected
        console.log("Unexpected response format:", data);
      }
      setisAuthenticated(true);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = useCallback(async () => {
    try {
      // Inform the backend about the logout
      await api.post("/auth/logout");

      // Reset the user state
      setUser(null);
      setisAuthenticated(false);

      // Clear authentication data from local storage
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");

      // You can also add any other cleanup or redirection logic here
    } catch (err) {
      console.error("Logout failed:", err);
      // Handle any errors that occur during logout
    }
  }, [api]);

  const promptGoogleSignIn = useCallback(() => {
    login();
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        promptGoogleSignIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
