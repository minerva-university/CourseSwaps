import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import img from "../../assets/Logo.png";

function Navbar() {
  const isLoggedIn = true;
  const user = {
    /* TODO: get the name and avatar from google auth */
    name: "John Doe",
    avatar: "/static/images/avatars/avatar_1.png",
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <img
            src={img}
            alt="Logo"
            style={{ width: "50px", height: "auto" }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CourseSwap
          </Typography>

          {isLoggedIn ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton size="large" color="inherit">
                <NotificationsIcon />
              </IconButton>
              <Typography variant="subtitle1">{user.name}</Typography>
              <Avatar alt={user.name} src={user.avatar} />{" "}
              {/* TODO: Add the Logout functionality from UserContext */}
              <Button color="inherit"> 
                Logout
              </Button>{" "}
              {/* Add the logout button here. */}
            </Box>
          ) : (
            <Box>
              <Button color="inherit">Login</Button>
              <Button color="inherit">Signup</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
