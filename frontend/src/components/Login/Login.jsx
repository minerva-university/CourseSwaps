import React from "react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { useUser } from "../../contexts/UserContext";
function Login() {
  const { promptGoogleSignIn } = useUser();
  return (
    <div className="SignUp">
      <Button
        variant="contained"
        color="primary"
        startIcon={<GoogleIcon />}
        onClick={promptGoogleSignIn}
      >
        Login with Google
      </Button>
    </div>
  );
}

export default Login;
