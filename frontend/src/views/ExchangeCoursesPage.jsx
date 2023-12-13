// ExchangeCoursesPage.js
import React from "react";
import Box from "@mui/material/Box";
import MyCourseList from "../components/ExchangeCourses/MyCourses/MyCoursesList";
import MySwapsList from "../components/ExchangeCourses/MySwaps/MySwapsList.jsx";
import SwapList from "../components/ExchangeCourses/Swap/SwapList";
import PickupsList from "../components/ExchangeCourses/Pickup/PickupsList";
import { RefreshProvider } from "../contexts/RefreshProvider";
import { PeriodicRefreshProvider } from "../contexts/PeriodicRefreshProvider";

const ExchangeCoursesPage = () => {
  return (
    <PeriodicRefreshProvider>
      <RefreshProvider>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: 3,
            gap: 2,
          }}
        >
          <MyCourseList />
          <MySwapsList />
          <SwapList />
          <PickupsList />
        </Box>
      </RefreshProvider>
    </PeriodicRefreshProvider>
  );
};

export default ExchangeCoursesPage;
