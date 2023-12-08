import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
  Snackbar,
  Alert
} from "@mui/material";
import { useApi } from "../../contexts/ApiProvider";

const AddAvailableToPickup = ({ currentCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity set to 1
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const api = useApi();

  const handleCourseChange = (event, value) => {
    setSelectedCourse(value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value)); // Ensure quantity is treated as a number
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedCourse) {
      try {
        const response = await api.post("/availabletopickup", {
          courseCode: selectedCourse.courseId,
          quantity,
        });

        console.log(response);

        if (response.status === 200) {
          setSnackbarMessage("Course added successfully");
          setSnackbarSeverity("success");
        } else {
          // assuming the API returns a JSON object with an error message
          const data = await response.data;
          setSnackbarMessage(data.error || "Error adding course");
          setSnackbarSeverity("error");
        }
      } catch (error) {
        console.error(error);
        setSnackbarMessage("An error occurred while adding the course.");
        setSnackbarSeverity("error");
      } finally {
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage("Please select a course and enter a valid quantity.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ minWidth: 200, maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
        Add Courses Available to Pickup
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Autocomplete
          options={currentCourses}
          getOptionLabel={(option) =>
            `${option.courseId}: ${option.courseName}`
          }
          onChange={handleCourseChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a Course"
              variant="outlined"
              margin="normal"
            />
          )}
          isOptionEqualToValue={(option, value) =>
            option.courseId === value.courseId
          }
        />
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          margin="normal"
          value={quantity}
          onChange={handleQuantityChange}
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: "100%" }}
        >
          Add
        </Button>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddAvailableToPickup;
