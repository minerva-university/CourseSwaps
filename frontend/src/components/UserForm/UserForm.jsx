// Assuming your JSON file is named courses.json and is in the src directory
import coursesData from "../../courses_data/courses.json"; //for the current classes and previous courses
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
  Checkbox,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

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
          {/* <div style={{ display: "flex" }}>
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
          </div> */}
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
          <Autocomplete
            multiple
            id="current-classes-selector"
            options={coursesData.courses.map((course) => course.courseId)}
            disableCloseOnSelect
            getOptionLabel={(option) =>
              `${option} - ${
                coursesData.courses.find((course) => course.courseId === option)
                  ?.courseName
              }`
            }
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {`${option} - ${
                  coursesData.courses.find(
                    (course) => course.courseId === option
                  )?.courseName
                }`}
              </li>
            )}
            value={formData.currentClasses}
            onChange={(event, newValue) => {
              if (newValue.length <= 4) {
                setFormData({ ...formData, currentClasses: newValue });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Currently Assigned Courses by MU Registrar"
                placeholder="Courses"
              />
            )}
          />

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
          <Autocomplete
            multiple
            id="previous-courses-selector"
            options={coursesData.courses.map((course) => course.courseId)}
            disableCloseOnSelect
            getOptionLabel={(option) =>
              `${option} - ${
                coursesData.courses.find((course) => course.courseId === option)
                  ?.courseName
              }`
            }
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {`${option} - ${
                  coursesData.courses.find(
                    (course) => course.courseId === option
                  )?.courseName
                }`}
              </li>
            )}
            value={formData.previousCourses}
            onChange={(event, newValue) => {
              setFormData({ ...formData, previousCourses: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Previous Courses (optional)"
                placeholder="Courses"
              />
            )}
          />

          <Divider style={{ marginTop: "16px", marginBottom: "16px" }} />
          <Button type="submit" variant="contained" style={submitButtonStyle}>
            Submit
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}
