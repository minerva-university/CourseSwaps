import { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom"; 
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import jwt_decode from 'jwt-decode';
import SignUp from "./components/SignUp/SignUp";


const clientId = "419464266191-idk1qqtf74j4uci9qu0d0uci0phfnp6t.apps.googleusercontent.com";

function App() {
  const [user, setUser] = useState({});

  function handleCredentialResponse(response) {
    console.log("encoded JWT ID Token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
    document.getElementById("signUpDiv").hidden = true; // Hide signup button as well
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
    document.getElementById("signUpDiv").hidden = false; // Show signup button when signed out
  }

  function handleSignUpResponse(response) {
    console.log("encoded JWT ID Token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
    document.getElementById("signUpDiv").hidden = true;
    window.location.href = "/SignUp";
  }

  function AppRouter() {
    return (
      <Router>
        <Switch>
          <Route path="/Signup" component={SignUp} />
        </Switch>
      </Router>
    );
  }
  
  
  

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: true
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {
        theme: "outline",
        size: "large",
        text: "Sign In",
        shape: "rectangular",
        width: "auto",
      }
    );

    google.accounts.id.renderButton( // Render the signup button
      document.getElementById("signUpDiv"),
      {
        theme: "outline",
        size: "large",
        text: "SignUp",
        shape: "circle",
        width: "auto",
      }
    );

    // Using browser cache for faster login
    //google.accounts.id.prompt();
  }, []);

  return (
    <>
      <div>
        <h1>Course Swap</h1>
        <div id="signInDiv"></div>
        <div id="signUpDiv"></div> {/* Add a div for the signup button */}
        {
          Object.keys(user).length !== 0 &&
          <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
        }

        {user && 
        <div>
          <img src={user.picture}></img>
          <p>{user.name}</p>
        </div>
        }
      </div>
    </>
  );
}

export default App;
