import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import PickupCourseItem from "./PickupCourseItem";
import Typography from "@mui/material/Typography";
import { useApi } from "../../../contexts/ApiProvider";
import { useRefresh } from "../../../contexts/RefreshProvider";

const PickupsList = () => {
  const [courses, setCourses] = useState([]);
  const api = useApi();
  const { refreshKey } = useRefresh();


  useEffect(() => {
    const fetchCourses = async () => {
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
    };

    fetchCourses();
  }, [api, refreshKey]);

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
        Pickup Courses
      </Typography>
      {courses.map((course) => (
        <PickupCourseItem key={course.id} code={course.code} title={course.name} count={course.count} courseId={course.id} />
      ))}
    </Box>
  );
};

export default PickupsList;
