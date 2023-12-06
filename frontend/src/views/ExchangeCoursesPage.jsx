// ExchangeCoursesPage.js
import React from "react";
import Box from "@mui/material/Box";
import MyCourseList from "../components/ExchangeCourses/MyCourses/MyCoursesList";
import SwapList from "../components/ExchangeCourses/Swap/SwapList";
import PickupsList from "../components/ExchangeCourses/Pickup/PickupsList";
import { RefreshProvider } from "../contexts/RefreshProvider";

const ExchangeCoursesPage = () => {
  return (
    <RefreshProvider>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 3,
        gap: 2,
      }}>
        <MyCourseList />
        <SwapList />
        <PickupsList />
      </Box>
    </RefreshProvider>
  );
};

export default ExchangeCoursesPage;
