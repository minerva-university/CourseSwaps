import React from "react";
import { useAuth } from "../contexts/AuthProvider";
import SignUp from "../components/Signup/Signup";
import Login from "../components/Login/Login";
import { Grid, Box } from "@mui/material";
import { Navigate } from "react-router-dom";

const AuthPage = () => {
  const { isAuthenticated, promptGoogleSignIn } = useAuth();

  return isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
