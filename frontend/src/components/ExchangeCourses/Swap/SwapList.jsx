import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import CourseToSwapItem from "./CourseToSwapItem";
import Typography from "@mui/material/Typography";
import { useApi } from "../../../contexts/ApiProvider";
import { useRefresh } from "../../../contexts/RefreshProvider";
import { usePeriodicRefresh } from "../../../contexts/PeriodicRefreshProvider";

const SwapList = () => {
  const [swaps, setSwaps] = useState([]); // Initialize as an empty array
  const api = useApi();
  const { refreshKey } = useRefresh();
  const { subscribe, unsubscribe } = usePeriodicRefresh();

  // useCallback to memoize the fetchSwaps function
  const fetchSwaps = useCallback(async () => {
    try {
      const response = await api.get('/availableswaps');
      if (response.ok && response.status === 200) {
        setSwaps(response.body.swaps || []); // Fallback to empty array if undefined
      } else {
        console.error('Failed to fetch swaps', response);
      }
    } catch (error) {
      console.error('Error fetching swaps:', error);
    }
  }, [api]);

  useEffect(() => {
    fetchSwaps();
  }, [fetchSwaps, refreshKey]);

  useEffect(() => {
    subscribe(fetchSwaps);
    return () => unsubscribe(fetchSwaps);
  }, [subscribe, unsubscribe, fetchSwaps]);

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
      {swaps && swaps.map(swap => (
        <CourseToSwapItem key={swap.id} username={swap.username} givesCourse={swap.courseGiven} wantsCourse={swap.courseWanted} />
      ))}
    </Box>
  );
};

export default SwapList;
