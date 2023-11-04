import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyCourse from "./MyCourseItem";
import { useApi } from "../../../contexts/ApiProvider";

const MyCoursesList = () => {
  const api_provider = useApi();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api_provider.get("/mycourses");
        if (response.ok) {
          setCourses(response.body.courses); // Assuming the response body has a 'courses' field with an array of courses
        } else {
          // Handle the error if the API doesn't return a successful response
          console.error("Failed to fetch courses:", response.statusText);
        }
      } catch (error) {
        // Handle the error if the request fails to send or there is no response
        console.error("There was an error fetching the courses:", error);
      }
    };

    fetchCourses();
  }, [api_provider]); // The empty array ensures this effect runs once after the component mounts

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
      {courses.map((course) => (
        <MyCourse key={course.id} title={course.title} /> // Assuming each course has an 'id' and 'title'
      ))}
    </Box>
  );
};

export default MyCoursesList;
