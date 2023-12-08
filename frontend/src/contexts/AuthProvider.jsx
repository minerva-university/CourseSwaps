import React, { createContext, useState, useContext, useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useApi } from "./ApiProvider";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const [isAuthenticated, setisAuthenticated] = useState(
    JSON.parse(localStorage.getItem("isAuthenticated")) || false,
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
      const response = await api.post("/auth/google", { access_token });
      const data = response.body;

      if (data && data.user) {
        setUser(data.user); // Includes the role
        setisAuthenticated(true);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user.id,
            given_name: data.user.given_name,
            picture: data.user.picture,
            role: data.user.role,
          })
        ); // Storing minimal user data for session management
        localStorage.setItem("isAuthenticated", true);
      } else {
        console.log("Unexpected response format:", data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setisAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    } catch (err) {
      console.error("Logout failed:", err);
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
