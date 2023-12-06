import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useApi } from "../../contexts/ApiProvider";

const AddAvailableToPickup = ({ currentCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quantity, setQuantity] = useState("");
  const { api } = useApi();

  const handleCourseChange = (event, value) => {
    setSelectedCourse(value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Course: ${selectedCourse?.courseId}, Quantity: ${quantity}`);
    if (selectedCourse && quantity) {
      try {
        const response = api.post("/admin/available-to-pickup", {
          courseId: selectedCourse.courseId,
          quantity,
        });

        console.log(response);
        if (response.status === 200) {
          alert("Course added successfully");
        } else if (response.status === 401) {
          alert(response.error);
        } else {
          alert("Error adding course");
        }
      } catch (error) {
        console.error(error);
      }
    }
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
              sx={{ "& .MuiOutlinedInput-root": { borderColor: "black" } }} // Add this line
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
    </Box>
  );
};

export default AddAvailableToPickup;
