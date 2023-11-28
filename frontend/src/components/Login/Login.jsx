import React from "react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../../contexts/AuthProvider";
function Login() {
  const { promptGoogleSignIn } = useAuth();
  return (
    <div className="SignUp">
      <Button
        variant="contained"
        color="primary"
        startIcon={<GoogleIcon />}
        onClick={promptGoogleSignIn}
        data-testid="login-component"
      >
        Login with Google
      </Button>
    </div>
  );
}

export default Login;
