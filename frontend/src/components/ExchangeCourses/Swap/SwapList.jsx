import React from "react";
import Box from "@mui/material/Box";
import CourseToSwapItem from "./CourseToSwapItem";
import { Typography } from "@mui/material";

const SwapList = () => {
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
        Swap Courses
      </Typography>
      <CourseToSwapItem title="Course 1A" />
      <CourseToSwapItem title="Course 1B" />
      <CourseToSwapItem title="Course 1C" />
      {/* Add more MyCourse components as needed */}
    </Box>
  );
};

export default SwapList;
