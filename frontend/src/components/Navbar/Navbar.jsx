import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../../contexts/AuthProvider";
import ViewUserProfile from "../ViewUserProfile/ViewUserProfile";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  // State to control the visibility of the Update User Profile component
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      setAnchorEl(null);
    }
  }, [isAuthenticated]);

  // Function to open the View User Profile component
  const openViewProfile = () => {
    setIsViewProfileOpen(true);
  };
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const MINERVA_LOGO =
    "https://assets-global.website-files.com/64ca995f0fd30a33b2fd01cc/64ca995f0fd30a33b2fd03e4_minerva.svg";
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed"> {/* Fixed to the top of the screen */}
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
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              CourseSwap
            </Typography>
          </Box>

          {isAuthenticated ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton size="large" color="inherit">
                <NotificationsIcon />
              </IconButton>
              <Typography variant="subtitle1">{user.given_name}</Typography>

              <Tooltip title="View Profile">
                <Avatar
                  alt={"User's Picture"}
                  src={user.picture}
                  onClick={handleAvatarClick}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={openViewProfile}>View Profile</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box></Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Conditional rendering of View User Profile component */}
      {isViewProfileOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <ViewUserProfile
            closeViewProfile={() => setIsViewProfileOpen(false)}
          />
        </div>
      )}
    </Box>
  );
}

export default Navbar;
