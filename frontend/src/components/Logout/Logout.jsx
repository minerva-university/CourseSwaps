import React from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setUser, setAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication status in localStorage
    localStorage.setItem("authenticated", "false");

    // Clear the user data by calling setUser with an empty object
    setUser({});
    setAuthenticated(false)

    // Navigate to the home page or any other appropriate page after logout
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
