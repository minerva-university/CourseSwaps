import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SwapForm from "./SwapForm"; // Import SwapForm component
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const MyCoursesList = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [open, setOpen] = useState(false);

  // Dummy data for userCourses and availableCourses
  const userCourses = ["Course 1", "Course 2", "Course 3"];
  const availableCourses = ["Course A", "Course B", "Course C"];

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
          <Typography variant="body1">{course}</Typography>
          <Button
            variant="contained"
            onClick={() => handleSwapButtonClick(course)}
            sx={{ backgroundColor: "black" }}
          >
            <SwapHorizIcon />
          </Button>
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
