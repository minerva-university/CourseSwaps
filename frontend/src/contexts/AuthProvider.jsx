/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext, useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useApi } from "./ApiProvider";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
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
    // flow: "access_token",
  });

  const authenticateUser = async (access_token) => {
    try {
      const response = await api.post("/auth/google", {
        access_token,
      });
      const data = response.body;

      if (data && data.user) {
        setUser(data.user);
        setAuthenticated(true);
      } else {
        // Handle the case where data is not as expected
        console.log("Unexpected response format:", data);
      }
      setAuthenticated(true);
    } catch (err) {
      console.log(err);
    }
  };

  const promptGoogleSignIn = useCallback(() => {
    login();
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        promptGoogleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
