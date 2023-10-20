import React from "react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";

function Login({ handleLogin, authenticated }) {
  return (
    <div className="SignUp">
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleLogin}
        >
         Login with Google
        </Button>
    </div>
  );
}

export default Login;
