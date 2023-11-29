import React from "react";
import Box from "@mui/material/Box";
import SwapButton from "./SwapButton";

const SwapForm = ({ userCourses, availableCourses }) => {
  const handleSwapSubmit = (selectedCourse, swapCourse) => {
    console.log(`Swap ${selectedCourse} with ${swapCourse}`);
    // Add logic to call the backend and perform the swap
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <SwapButton
        onSwapSubmit={handleSwapSubmit}
        userCourses={userCourses}
        availableCourses={availableCourses}
      />
    </Box>
  );
};

export default SwapForm;
