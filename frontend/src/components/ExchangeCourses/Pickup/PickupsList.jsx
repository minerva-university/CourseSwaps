import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import PickupCourseItem from "./PickupCourseItem";
import Typography from "@mui/material/Typography";
import { useApi } from "../../../contexts/ApiProvider";
import { useRefresh } from "../../../contexts/useRefresh";
import { usePeriodicRefresh } from "../../../contexts/usePeriodicRefresh";

const PickupsList = () => {
  const [courses, setCourses] = useState([]);
  const api = useApi();
  const { refreshKey } = useRefresh();
  const { subscribe, unsubscribe } = usePeriodicRefresh();

  // useCallback to memoize the fetchCourses function
  const fetchCourses = useCallback(async () => {
    try {
      const response = await api.get('/availableforpickup');
      if (response.ok && response.status === 200) {
        setCourses(response.body.available_courses);
      } else {
        console.error('Failed to fetch courses', response);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, [api]); // api as dependency

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, refreshKey]);

  useEffect(() => {
    subscribe(fetchCourses);

    return () => {
      unsubscribe(fetchCourses);
    };
  }, [subscribe, unsubscribe, fetchCourses]);

  return (
    <Box
      sx={{
        width: '100%', // Set a default width for all screen sizes
        bgcolor: "#f0f0f0",
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        '@media (min-width: 768px)': {
          maxWidth: "360px", // Set a fixed width for larger devices (adjust the breakpoint and width as needed)
        },
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
        Pickup courses
      </Typography>
      {courses.map((course) => (
        <PickupCourseItem key={course.id} code={course.code} title={course.name} count={course.count} courseId={course.id} />
      ))}
    </Box>
  );
};

export default PickupsList;
