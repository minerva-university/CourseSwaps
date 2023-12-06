import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SwapForm from "./SwapForm";
import DropButton from "./DropButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useApi } from "../../../contexts/ApiProvider";
import { useRefresh } from "../../../contexts/RefreshProvider";


const MyCoursesList = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const api = useApi();
  const { refreshKey } = useRefresh();

  // Dummy data for userCourses and availableCourses
  const availableCourses = ["Course A", "Course B", "Course C"];

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const response = await api.get('/mycourses'); // Adjust the endpoint as needed
        if (response.ok) {
          if (response.body.current_courses) {
          setUserCourses(response.body.current_courses);
        } else {
          console.error('The user currently has no courses. If this is a bug, contact the administrator.');
        }
        } else {
          console.error('Error fetching courses', response.body.error);
        }
      } catch (error) {
        console.error('Error fetching courses', error);
      }
    };

    fetchUserCourses();
  }, [api, refreshKey]);

  const handleSwapButtonClick = (course) => {
    setSelectedCourse(course);
    setOpen(true);
  };

  const handleCloseSwapForm = () => {
    setSelectedCourse(null);
    setOpen(false);
  };

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

      {userCourses.map((course, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: "white",
            marginBottom: 2,
            borderRadius: 2,
            padding: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            {" "}
            {course.code}: {course.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => handleSwapButtonClick(course)}
              sx={{ backgroundColor: "black" }}
            >
              <SwapHorizIcon />
            </Button>
            <DropButton key={course.id} courseName={course.name} courseId={course.id}/>
          </Box>
        </Box>
      ))}

      <Dialog open={open} onClose={handleCloseSwapForm} maxWidth="lg">
        <DialogContent>
          <SwapForm
            userCourses={userCourses}
            availableCourses={availableCourses}
            selectedCourse={selectedCourse}
            onClose={handleCloseSwapForm}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MyCoursesList;
