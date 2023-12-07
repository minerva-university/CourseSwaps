import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import coursesData from "../courses_data/courses.json";
import AddAvailableToPickup from "../components/AdminDashboard/AddAvailableToPickup";
import { useAuth } from "../contexts/AuthProvider";

const AdminDashboardPage = () => {
  // Load courses from the JSON file
  const [currentCourses, setCurrentCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load courses from the JSON file
    setCurrentCourses(coursesData.courses);
  }, []);

  if (!user || user.role !== "admin") {
    // Redirect or show an error message if not admin
    return <div><h1>Access Denied</h1></div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        gap: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%", // Ensure it takes the full width
          gap: 2,
        }}
      >
        <AddAvailableToPickup currentCourses={currentCourses} />
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
