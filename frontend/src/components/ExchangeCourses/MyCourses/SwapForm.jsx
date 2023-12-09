import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useApi } from "../../../contexts/ApiProvider";

const SwapForm = ({ open, onClose, selectedCourse }) => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const api = useApi();

  useEffect(() => {
    const fetchAvailableSwaps = async () => {
      try {
        const response = await api.get("/swap_courses");
        if (response.ok) {
          setAvailableCourses(response.body.all_courses);
        } else {
          console.error("Error fetching available swaps", response.body.error);
        }
      } catch (error) {
        console.error("Error fetching available swaps", error);
      }
    };

    fetchAvailableSwaps();
  }, [api]);

  const handleConfirmSwap = () => {
    setConfirmDialogOpen(true);
  };

  const handleActualSwap = async () => {
    try {
      setConfirmDialogOpen(false);
      const response = await api.post("/add_availableswaps", {
        selectedCourse,
        selectedCourses,
      });
      if (response.ok) {
        setSnackbarMessage("Swap confirmed successfully");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Failed to confirm swap");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while confirming the swap");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setSelectedCourses([]);
      onClose();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const ConfirmationDialog = ({ selectedCourse }) => {
    return (
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Course Swap</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to swap {selectedCourse?.code} for{" "}
            {selectedCourses.map((course) => course.course_code).join(", ")}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleActualSwap}>Confirm</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "80%",
      }}
    >
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}
        maxWidth="md" // Adjust dialog width here
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "50%",
            height: "auto",
          },
        }} // Custom styles
      >
        <DialogTitle>Choose Courses to Swap</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Select all the courses you would be willing to swap for.
          </Typography>
          <Autocomplete
            multiple
            options={availableCourses}
            getOptionLabel={(option) => option.course_code}
            onChange={(event, newValue) => setSelectedCourses(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Search Courses"
                fullWidth
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleConfirmSwap}
            disabled={selectedCourses.length === 0}
          >
            Confirm Swap
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog selectedCourse={selectedCourse} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={800}
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
export default SwapForm;
