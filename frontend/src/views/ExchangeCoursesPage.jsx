import React from "react";
import Box from "@mui/material/Box";
import MyCourseList from "../components/ExchangeCourses/MyCourses/MyCoursesList";
import PickupsList from "../components/ExchangeCourses/Pickup/PickupsList";
import SwapList from "../components/ExchangeCourses/Swap/SwapList";

const ExchangeCoursesPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Align items to the center
        alignItems: "flex-start", // Align items to the start of the cross axis
        padding: 3,
        gap: 2, // Adjust the gap to your preference for spacing between the lists
      }}
    >
      <MyCourseList />
      <SwapList />
      <PickupsList />
    </Box>
  );
};

export default ExchangeCoursesPage;
