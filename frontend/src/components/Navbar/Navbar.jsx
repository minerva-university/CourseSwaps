import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../../contexts/AuthProvider";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const MINERVA_LOGO =
    "https://assets-global.website-files.com/64ca995f0fd30a33b2fd01cc/64ca995f0fd30a33b2fd03e4_minerva.svg";
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img
              src={MINERVA_LOGO}
              alt="Logo"
              style={{ width: "auto", height: "auto" }}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              CourseSwap
            </Typography>
          </Box>

          {isAuthenticated ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton size="large" color="inherit">
                <NotificationsIcon />
              </IconButton>
              <Typography variant="subtitle1">{user.given_name}</Typography>
              <Avatar alt={"User's Picture"} src={user.picture} />
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box></Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
