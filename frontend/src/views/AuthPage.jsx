import React from "react";
import { useAuth } from "../contexts/AuthProvider";
import GoogleSignIn from "../components/GoogleSignIn/GoogleSignIn";
import { Box, Paper, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import logo from "../assets/logo_quality.jpeg";

const AuthPage = () => {
  const { isAuthenticated, user } = useAuth();

  const UserFlow = ({ user }) => {
    if (user.new_user === false){
      return <Navigate to="/" />;
    } else {
      return <Navigate to="/userform" />;
    }
  };

  return isAuthenticated ? (
    <UserFlow user={user} />
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 2, md: 6 }, // Responsive padding
          mt: 4,
          width: '100%', // Take up 100% of the container width
          maxWidth: '600px', // Max width of the Paper
          border: 1,
          borderColor: "grey.300",
          borderRadius: 2,
        }}
      >
        {/* "Welcome" text */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            // marginBottom: '20px', // Space below the "Welcome" text
            textAlign: 'center',
            width: '100%', // Ensures the text is centered within its block
          }}
        >
          Welcome to CourseSwap.
        </Typography>

        {/* Image container */}
        <Box
          component="img"
          sx={{
            width: '100%', // Make width responsive
            maxWidth: '350px', // Max image width
            height: 'auto', // Keep the aspect ratio of the image
            // marginBottom: 4, // Add some space below the image
          }}
          src={logo}
          alt="Company Logo"
        />

        <GoogleSignIn />
      </Paper>
    </Box>
  );
};

export default AuthPage;
