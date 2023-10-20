import React, { useState, useCallback, useEffect } from "react";
import SignUp from "../components/Signup/Signup";
import Login from "../components/Login/Login.jsx";
import jwt_decode from "jwt-decode";
import Logout from "../components/logout/Logout";
import Home from "./HomePage";

const clientId = "419464266191-idk1qqtf74j4uci9qu0d0uci0phfnp6t.apps.googleusercontent.com";

const AuthPage = () => {
  const [user, setUser] = useState({});
  const [authenticated, setAuthenticated] = useState(false);

  const handleCallbackResponse = (response) => {
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    setAuthenticated(true);

    // Store the authentication status in localStorage
    localStorage.setItem("authenticated", "true");
  };

  const handleGoogleSignup = useCallback(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCallbackResponse,
    });

    google.accounts.id.prompt(); // This will prompt the user for Google authentication
  }, []);

  const handleGoogleLogin = useCallback(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCallbackResponse,
    });

    google.accounts.id.prompt(); // This will prompt the user for Google authentication
  }, []);

  // Check for authentication status in localStorage when the component mounts
  useEffect(() => {
    const storedAuthenticated = localStorage.getItem("authenticated");
    if (storedAuthenticated === "true") {
      setAuthenticated(true);
    }
  }, []);
  return (
    authenticated ? (
      <>
      <h1>Hello</h1>
      <Home user={user}/>
      <Logout setUser={setUser} user={user} setAuthenticated={setAuthenticated} />
      </>
    ) : (
      <>
        <SignUp handleSignUp={handleGoogleSignup} authenticated={authenticated} user={user} />
        <Login handleLogin={handleGoogleLogin} authenticated={authenticated} user={user} />
      </>
    )
  );
};

export default AuthPage;
