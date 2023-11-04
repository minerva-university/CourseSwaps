import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyCourse from "./MyCourseItem";

const MyCoursesList = () => {
  return (
    <Box
      sx={{
        maxWidth: 360,
        bgcolor: "#f0f0f0",
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: "bold",
          marginBottom: 2,
          textAlign: "center",
          color: "#333",
        }}
      >
        My Courses
      </Typography>
      <MyCourse title="CS114" />
      <MyCourse title="CS162" />
      <MyCourse title="CS110" />
      {/* Add more MyCourse components as needed */}
    </Box>
  );
};

export default MyCoursesList;
