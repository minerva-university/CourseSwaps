// Assuming your JSON file is named courses.json and is in the src directory
import coursesData from "../../courses_data/courses.json"; //for the current classes and previous courses
import majorsData from "../../courses_data/data.json"; //for the concentrations and majors
import React, { useState } from "react";
import { useApi } from "../../contexts/ApiProvider";
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
  fontSize: "24px",
};

const submitButtonStyle = {
  marginTop: "16px",
  display: "block",
};

export default function UserFormPage() {
  const [formData, setFormData] = useState({
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

  const  api  = useApi();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await api.post("/register", formData);

    if (response.status === 200) {
      console.log("Successfully registered user");
    } else {
      console.log("Failed to register user");
    }
  };

  return (
    <Grid container justifyContent="center">
      <Paper elevation={3} style={paperStyle}>
        <Typography variant="h4" style={titleStyle}>
          Fill out the form below to create your profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl style={formControlStyle}>
            <InputLabel id="class-label">Class</InputLabel>
            <Select
              labelId="class-label"
              name="class"
              value={formData.class}
              onChange={handleChange}
              label="Class"
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
          <FormControl
            style={{ ...formControlStyle, minWidth: "400px" }}
            data-testid="current-classes-select"
          >
            <InputLabel id="current-classes-label">
              Currently Assigned Courses by MU Registrar
            </InputLabel>
            <Select
              labelId="current-classes-label"
              multiple
              name="currentClasses"
              value={formData.currentClasses}
              onChange={handleChange}
              label="Currently Assigned Courses by MU Registrar"
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
              label="Major"
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
              label="Concentration"
            >
              {/* Populate concentrations based on selected major */}
              {majorsData.majors
                .find((major) => major.majorId === formData.major)
                ?.Concentrations.map((concentration) => (
                  <MenuItem key={concentration} value={concentration}>
                    {concentration}
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
              label="Minor"
            >
              {/* Populate minors based on selected major */}
              {majorsData.minors.map((minor, index) => (
                <MenuItem
                  key={`${minor.minorId}-${index}`}
                  value={minor.minorId}
                >
                  {minor.minorId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            style={{ ...formControlStyle, minWidth: "400px" }}
            data-testid="previous-courses-select"
          >
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
              label="Previous Courses (optional)"
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
