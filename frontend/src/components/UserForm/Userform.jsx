// Assuming your JSON file is named courses.json and is in the src directory
import coursesData from "../../courses_data/courses.json";
import majorsData from "../../courses_data/data.json"; //for the concentrations and majors
import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Divider,
  Paper,
  Grid,
} from "@mui/material";

const formControlStyle = {
  minWidth: "200px",
  maxWidth: "400px",
  margin: "8px",
};

const paperStyle = {
  padding: "20px",
  width: "100%",
  maxWidth: "600px",
  margin: "auto",
  marginTop: "50px",
};

const titleStyle = {
  marginBottom: "16px",
  textAlign: "center",
  fontSize: "24px", // Adjust the font size
};

const submitButtonStyle = {
  marginTop: "16px",
  display: "block", // Display the button as a block element
};

export default function UserFormPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    class: "",
    minervaID: "",
    currentClasses: [],
    previousCourses: [],
    major: "",
    concentration: "",
    minor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type === "select-multiple") {
      const values = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission logic here, e.g., send data to an API or something else
    console.log(formData);
  };

  return (
    <Grid container justifyContent="center">
      <Paper elevation={3} style={paperStyle}>
        <Typography variant="h4" style={titleStyle}>
          Fill out the form below to create your profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex" }}>
            <FormControl style={{ ...formControlStyle, marginRight: "8px" }}>
              <TextField
                label="First Name"
                name="firstName"
                required
                onChange={handleChange}
                value={formData.firstName}
              />
            </FormControl>
            <FormControl style={{ ...formControlStyle, marginLeft: "8px" }}>
              <TextField
                label="Last Name"
                name="lastName"
                required
                onChange={handleChange}
                value={formData.lastName}
              />
            </FormControl>
          </div>
          <FormControl style={formControlStyle}>
            <InputLabel id="class-label">Class</InputLabel>
            <Select
              labelId="class-label"
              name="class"
              value={formData.class}
              onChange={handleChange}
            >
              <MenuItem value="M24">M24</MenuItem>
              <MenuItem value="M25">M25</MenuItem>
              <MenuItem value="M26">M26</MenuItem>
              <MenuItem value="M27">M27</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={formControlStyle}>
            <TextField
              label="Minerva Student ID (6 digits)"
              name="minervaID"
              required
              inputProps={{ maxLength: 6 }}
              onChange={handleChange}
              value={formData.minervaID}
            />
          </FormControl>
          <FormControl style={{ ...formControlStyle, minWidth: "400px" }}>
            <InputLabel id="current-classes-label">
              Currently Assigned Courses by MU Registrar
            </InputLabel>
            <Select
              labelId="current-classes-label"
              multiple
              name="currentClasses"
              value={formData.currentClasses}
              onChange={handleChange}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <div key={value}>{value}</div>
                  ))}
                </div>
              )}
            >
              {coursesData.courses.map((course) => (
                <MenuItem key={course.courseId} value={course.courseId}>
                  {`${course.courseId} - ${course.courseName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={formControlStyle}>
            <InputLabel id="major-label">Major</InputLabel>
            <Select
              labelId="major-label"
              name="major"
              value={formData.major}
              onChange={handleChange}
            >
              {majorsData.majors.map((major) => (
                <MenuItem key={major.majorId} value={major.majorId}>
                  {major.majorId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={formControlStyle}>
            <InputLabel id="concentration-label">Concentration</InputLabel>
            <Select
              labelId="concentration-label"
              name="concentration"
              value={formData.concentration}
              onChange={handleChange}
            >
              {/* Populate concentrations based on selected major */}
              {majorsData.majors
                .find((major) => major.majorId === formData.major)
                ?.Courses[0].map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl style={formControlStyle}>
            <InputLabel id="minor-label">Minor</InputLabel>
            <Select
              labelId="minor-label"
              name="minor"
              value={formData.minor}
              onChange={handleChange}
            >
              {/* Populate minors based on selected major */}
              {majorsData.majors
                .find((major) => major.majorId === formData.major)
                ?.Courses[1].map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl style={{ ...formControlStyle, minWidth: "400px" }}>
            <InputLabel id="previous-courses-label">
              Previous Courses (optional)
            </InputLabel>
            <Select
              labelId="previous-courses-label"
              multiple
              name="previousCourses"
              value={formData.previousCourses}
              onChange={handleChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {coursesData.courses.map((course) => (
                <MenuItem key={course.courseId} value={course.courseId}>
                  {`${course.courseId} - ${course.courseName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider style={{ marginTop: "16px", marginBottom: "16px" }} />
          <Button type="submit" variant="contained" style={submitButtonStyle}>
            Submit
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}