// ExchangeCoursesPage.js
import React from "react";
import Box from "@mui/material/Box";
import MyCourseList from "../components/ExchangeCourses/MyCourses/MyCoursesList";
import MyPreferredSwapsList from "../components/ExchangeCourses/MyPreferredSwaps/MyPreferredSwapsList.jsx";
import AvailableSwapsList from "../components/ExchangeCourses/Available Swaps/SwapList.jsx";
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
          <MyPreferredSwapsList />
          <AvailableSwapsList />
          <PickupsList />
        </Box>
      </RefreshProvider>
    </PeriodicRefreshProvider>
  );
};

export default ExchangeCoursesPage;
