import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SwapForm from "./SwapForm";
import DropButton from "./DropButton";
import { useApi } from "../../../contexts/ApiProvider";
import { useRefresh } from "../../../contexts/useRefresh";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { usePeriodicRefresh } from '../../../contexts/usePeriodicRefresh';

const MyCoursesList = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [isDropDialogOpen, setIsDropDialogOpen] = useState(false);
  const [selectedDropCourse, setSelectedDropCourse] = useState(null);
  const api = useApi();
  const { refreshKey } = useRefresh();
  const { triggerRefresh } = useRefresh();
  const { subscribe, unsubscribe } = usePeriodicRefresh();

  const fetchUserCourses = useCallback(async () => {
    try {
      const response = await api.get('/mycourses'); 
      if (response.ok) {
        if (response.body.current_courses) {
          console.log('User courses:', response.body.current_courses);
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
  }, [api]);

  useEffect(() => {
    fetchUserCourses();
  }, [api, refreshKey]);

  const checkCourse = async (course) => {
    try {
      const response = await api.post(`/check_courses/${course.id}`);
      if (response.ok && response.body.is_current_course) {
        return true;
      } else if (response.ok && !response.body.is_current_cours) {
        return false;
      }
    } catch (error) {
      console.error("Error checking course", error);
    }
  };

  const handleSwapButtonClick = async (course) => {
    const canswap = await checkCourse(course);
    if (canswap) {
      setSelectedCourse(course);
      setOpen(true);
    } else {
      setSnackbarMessage(
        "You cannot swap this course because it is not in your current courses."
      );
      setSnackbarSeverity("error");
      triggerRefresh();
      setSnackbarOpen(true);
    }
  };
  
  const handleOpenDropDialog = (course) => {
    setSelectedDropCourse(course);
    setIsDropDialogOpen(true);
  };

  const handleCloseDropDialog = () => {
    setIsDropDialogOpen(false);
    setSelectedDropCourse(null);
  useEffect(() => {
    subscribe(fetchUserCourses);
    return () => unsubscribe(fetchUserCourses);
  }, [subscribe, unsubscribe, fetchUserCourses]);


  const handleSwapButtonClick = (course) => {
    setSelectedCourse(course);
    setOpen(true);
  };


  const handleCloseSwapForm = () => {
    setSelectedCourse(null);
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
    setSnackbarMessage("");
    setSnackbarSeverity("info");
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
              sx={{ backgroundColor: "black", height: "30.5px" }}
            >
              <SwapHorizIcon />
            </Button>
            <DropButton
              key={course.id}
              courseName={course.name}
              courseId={course.id}
              checkCourse={checkCourse}
              sx={{
                flex: "1",
              }}
            />
          </Box>
        </Box>
      ))}
      <SwapForm
        open={open}
        onClose={handleCloseSwapForm}
        selectedCourse={selectedCourse}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyCoursesList;
