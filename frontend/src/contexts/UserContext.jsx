/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext, useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useApi } from "./ApiProvider";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const api = useApi();

  const login = useGoogleLogin({
    onSuccess: (res) => {
      console.log("Login Success", res);
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
      const { data } = await api.post("/auth/google", {
        access_token,
      });

      setUser(data.user);
      setAuthenticated(true);
    } catch (err) {
      console.log(err);
    }
  };

  const promptGoogleSignIn = useCallback(() => {
    login();
  }, [login]);

  return (
    <UserContext.Provider
      value={{
        user,
        authenticated,
        promptGoogleSignIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
