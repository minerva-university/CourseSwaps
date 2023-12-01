import React, { useState, useEffect } from "react";
import { useApi } from "../../contexts/ApiProvider";
import {
  Button,
  Paper,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ViewUserProfile = ({ closeViewProfile }) => {
  // Initialize userData with default properties
  const [userData, setUserData] = useState({
    class: "",
    minervaID: "",
    currentClasses: [],
    previousCourses: [],
    major: "",
    concentration: "",
    minor: "",
  });

  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/view-userdata", {
          withCredentials: true,
        });
        console.log(response); // Log the full response object
        if (response.status === 200 && response.body) {
          console.log("Data received:", response.body); // Log the response body
          setUserData(response.body);
        } else {
          console.log("Failed to fetch user data", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, [api]);

  const handleEditClick = () => {
    closeViewProfile();
    navigate("/userform", { state: { ...userData, isUpdateMode: true } });
  };

  // Conditional rendering to check if userData properties are populated
  return (
    <Grid container justifyContent="center" style={{ padding: "20px" }}>
      <Paper
        elevation={3}
        style={{ padding: "20px", maxWidth: "600px", width: "100%" }}
      >
        <Typography
          variant="h4"
          style={{ marginBottom: "16px", textAlign: "center" }}
        >
          View Your Profile
        </Typography>
        <Divider style={{ marginBottom: "16px" }} />
        <List>
          <ListItem>
            <ListItemText primary="Class Batch" secondary={userData.class} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Minerva Student ID"
              secondary={userData.minervaID || "N/A"}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Current Courses"
              secondary={userData.currentClasses.join(", ") || "N/A"}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Previous Courses"
              secondary={userData.previousCourses.join(", ") || "N/A"}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Major" secondary={userData.major} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Concentration"
              secondary={userData.concentration || "Not specified"}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Minor"
              secondary={userData.minor || "Not specified"}
            />
          </ListItem>
        </List>
        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={closeViewProfile}
            style={{ marginRight: "8px" }}
          >
            Close
          </Button>
          <Button variant="contained" color="primary" onClick={handleEditClick}>
            Edit Profile
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ViewUserProfile;
