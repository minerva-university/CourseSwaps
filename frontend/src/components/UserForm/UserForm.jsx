// Assuming your JSON file is named courses.json and is in the src directory
import coursesData from "../../courses_data/courses.json"; //for the current classes and previous courses
import majorsData from "../../courses_data/data.json"; //for the concentrations and majors
import React, { useState } from "react";
import { useApi } from "../../contexts/ApiProvider";
import validateFormData from "./UserFormValidator";
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
  FormHelperText,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const formControlStyle = {
  flexGrow: 1,
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
  marginLeft: "auto",
};

const gridContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const autocompleteStyle = {
  flexGrow: 1,
  margin: "8px",
};

const menuPaperStyle = {
  maxHeight: 200,
};

const menuProps = {
  PaperProps: {
    style: menuPaperStyle,
  },
};

// for the major and concentration input fields
const dualFieldContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  width: "100%",
  margin: "8px 0",
};

// for the minor input field
const halfWidthContainerStyle = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  maxWidth: "800px",
  margin: "8px 0",
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
  const [formErrors, setFormErrors] = useState({});

  // Function to check for any form errors
  const checkForErrors = (data) => {
    const validation = validateFormData(data);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // Handle field changes and perform live validation
  const handleChange = (e, newValue) => {
    if (
      e.target.name === "currentClasses" ||
      e.target.name === "previousCourses"
    ) {
      setFormData({ ...formData, [e.target.name]: newValue });
      // Perform validation check after the state is updated
      setTimeout(
        () => checkForErrors({ ...formData, [e.target.name]: newValue }),
        0
      );
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      // Perform validation check after the state is updated
      setTimeout(() => checkForErrors({ ...formData, [name]: value }), 0);
    }
  };

  const api = useApi();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateFormData(formData);
    setFormErrors(validation.errors);

    if (validation.isValid) {
      // Submit the form data
      try {
        const response = await api.post("/userdata", formData);
        if (response.status === 200) {
          console.log("Successfully registered user");
        } else {
          console.log("Failed to register user");
        }
      } catch (error) {
        console.error("Error submitting form", error);
      }
    }
  };

  return (
    <Grid container style={gridContainerStyle}>
      <Paper elevation={3} style={paperStyle}>
        <Typography variant="h4" style={titleStyle}>
          Fill out the form below to create your profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <div style={dualFieldContainerStyle}>
            <FormControl error={!!formErrors.class} style={formControlStyle}>
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
              <FormHelperText>{formErrors.class}</FormHelperText>
            </FormControl>

            <FormControl
              error={!!formErrors.minervaID}
              style={formControlStyle}
            >
              <TextField
                label="Minerva Student ID (6 digits)"
                name="minervaID"
                required
                inputProps={{ maxLength: 6 }}
                onChange={handleChange}
                value={formData.minervaID}
                error={!!formErrors.minervaID}
                helperText={formErrors.minervaID || "Enter a 6-digit number"}
              />
            </FormControl>
          </div>

          <Autocomplete
            style={autocompleteStyle}
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
                error={!!formErrors.currentClasses}
                helperText={
                  formErrors.currentClasses && "Please select up to 4 courses."
                }
                label="Currently Assigned Courses by MU Registrar"
                placeholder="Courses"
              />
            )}
          />
          <div style={dualFieldContainerStyle}>
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
          </div>

          <div style={halfWidthContainerStyle}>
            <FormControl
              error={!!formErrors.minor}
              style={formControlStyle}
              fullWidth
            >
              <InputLabel id="minor-label">Minor</InputLabel>
              <Select
                labelId="minor-label"
                name="minor"
                value={formData.minor}
                onChange={handleChange}
                label="Minor"
                MenuProps={menuProps}
              >
                {majorsData.minors.map((minor, index) => (
                  <MenuItem
                    key={`${minor.minorId}-${index}`}
                    value={minor.minorId}
                  >
                    {minor.minorId}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.minor}</FormHelperText>
            </FormControl>
          </div>
          <Autocomplete
            style={autocompleteStyle}
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
              handleChange({ target: { name: "previousCourses" } }, newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!formErrors.previousCourses}
                helperText={
                  formErrors.previousCourses || "Select at least one course"
                }
                label="Previous Courses"
                placeholder="Courses"
              />
            )}
          />

          <Divider style={{ marginTop: "16px", marginBottom: "16px" }} />
          <Button
            type="submit"
            variant="contained"
            style={submitButtonStyle}
            disabled={!validateFormData(formData).isValid}
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}
