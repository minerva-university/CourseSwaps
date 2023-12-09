import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../contexts/ApiProvider';
import validateFormData from './UserFormValidator';
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
  Autocomplete,
} from '@mui/material';

import coursesData from '../../courses_data/courses.json';
import majorsData from '../../courses_data/data.json';

// Styles
const formControlStyle = { flexGrow: 1, margin: '8px' };
const paperStyle = { padding: '20px', width: '100%', maxWidth: '600px', margin: 'auto', marginTop: '50px' };
const titleStyle = { marginBottom: '16px', textAlign: 'center', fontSize: '24px' };
const submitButtonStyle = { marginTop: '16px', display: 'block', marginLeft: 'auto' };
const gridContainerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
const autocompleteStyle = { flexGrow: 1, margin: '8px' };
const menuPaperStyle = { maxHeight: 200 };
const menuProps = { PaperProps: { style: menuPaperStyle } };
const dualFieldContainerStyle = { display: 'flex', justifyContent: 'space-between', gap: '16px', width: '100%', margin: '8px 0' };
const halfWidthContainerStyle = { display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '800px', margin: '8px 0' };

export default function UserFormPage() {
  const [formData, setFormData] = useState({
    class: '',
    minervaID: '',
    currentClasses: [],
    previousCourses: [],
    major: '',
    concentration: '',
    minor: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const api = useApi();


  useEffect(() => {
    // Check for overlapping courses whenever currentClasses or previousCourses change
    setFormErrors(formErrors => {
      const overlapError = formData.currentClasses.some(course => formData.previousCourses.includes(course))
        ? 'Cannot select the same course as both currently assigned course and previously completed course'
        : '';
  
      return { ...formErrors, currentClasses: overlapError, previousCourses: overlapError };
    });
  }, [formData.currentClasses, formData.previousCourses]);
  

  
  const handleChange = (event, newValue) => {
    if (event.target.name === 'currentClasses' || event.target.name === 'previousCourses') {
      // Only update formData, the useEffect hook will handle error checking
      setFormData({ ...formData, [event.target.name]: newValue });
    } else {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
  
      // Existing validation for Minerva Student ID
      if (name === 'minervaID') {
        setFormErrors({
          ...formErrors,
          minervaID: /^\d{6}$/.test(value) ? '' : 'ID must be exactly 6 digits'
        });
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateFormData(formData);
    setFormErrors(validation.errors);

    if (validation.isValid) {
      try {
        const response = await api.post('/userdata', formData);
        if (response.status === 200) {
          console.log('Successfully registered user');
          navigate('/');
        } else {
          console.log('Failed to register user');
        }
      } catch (error) {
        console.error('Error submitting form', error);
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
                  formErrors.previousCourses || "Cannot select the same course as both currently assigned course and previously completed course"
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