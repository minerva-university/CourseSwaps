import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";

function SignUp({ handleSignUp, authenticated }) {
  const navigate = useNavigate();

  const signUpProcess = () => {
      handleSignUp()
      if(authenticated){
        navigate('/userform')
      }
  }
  

  return (
    <div className="SignUp">
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={signUpProcess}
        >
          Sign Up with Google
        </Button>
    </div>
  );
}

export default SignUp;
