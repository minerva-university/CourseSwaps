import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const SwapButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [swapCourse, setSwapCourse] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);

  const open = Boolean(anchorEl);


  const fetchAvailableSwaps = async () => {
    try {
      const response = await fetch('/availableswaps', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      setAvailableCourses(data.available_swaps);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchAvailableSwaps(); // Fetch the available swaps when the user wants to select a course to swap with
  };


  const handleSwapCourseSelect = (course) => {
    setSwapCourse(course);
    handleClose();
  };

  const handleConfirmSwap = () => {
    console.log(`Confirmed swap of ${selectedCourse} with ${swapCourse}`);
    // Perform the swap logic here
    setSelectedCourse('');
    setSwapCourse('');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Swap With button */}
      <Button
        variant="outlined"
        size="small"
        onClick={handleClick}
      >
        {swapCourse || 'Swap With'}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* Menu populated with available courses fetched from the server */}
        {availableCourses.map((course) => (
          <MenuItem key={course.id} onClick={() => handleSwapCourseSelect(course.name)}>
            {course.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Confirm Swap button */}
      <Button
        variant="contained"
        color="primary"
        size="small"
        disabled={!selectedCourse || !swapCourse}
        onClick={handleConfirmSwap}
        sx={{ mt: 1 }}
      >
        Confirm Swap
      </Button>
    </Box>
  );
};

export default SwapButton;
