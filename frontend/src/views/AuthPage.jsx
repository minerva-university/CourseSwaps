import React from "react";
import { useAuth } from "../contexts/AuthProvider";
import SignUp from "../components/Signup/Signup";
import Login from "../components/Login/Login";
import Logout from "../components/logout/Logout";
import Home from "./HomePage";
import { Grid, Box } from "@mui/material";

const AuthPage = () => {
  const { authenticated, promptGoogleSignIn } = useAuth();

  return authenticated ? (
    <>
      <h1>Hello</h1>
      <Home />
      <Logout />
    </>
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} container justifyContent="center" spacing={2}>
          <Grid item xs="auto">
            <SignUp handleSignUp={promptGoogleSignIn} />
          </Grid>
          <Grid item xs="auto">
            <Login handleLogin={promptGoogleSignIn} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthPage;
