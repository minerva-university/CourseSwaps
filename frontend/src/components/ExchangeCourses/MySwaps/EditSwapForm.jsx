import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useApi } from "../../../contexts/ApiProvider";

const EditSwapForm = ({ open, handleClose, swapId, onSuccess, onError }) => {
  const [myCourses, setMyCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedGivingCourse, setSelectedGivingCourse] = useState(null);
  const [selectedWantedCourse, setSelectedWantedCourse] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get("/mycourses");
        if (response.ok) {
          setMyCourses(response.body.current_courses);
        } else {
          console.error("Error fetching my courses", response.body.error);
          onError("Error fetching my courses");
        }
      } catch (error) {
        console.error("Error fetching my courses", error);
        onError("Error fetching my courses");
      }
    };

    const fetchAvailableSwaps = async () => {
      try {
        const response = await api.get("/swap_courses");
        if (response.ok) {
          setAvailableCourses(response.body.all_courses);
        } else {
          console.error("Error fetching available swaps", response.body.error);
          onError("Error fetching available swaps");
        }
      } catch (error) {
        console.error("Error fetching available swaps", error);
        onError("Error fetching available swaps");
      }
    };

    if (open) {
      fetchMyCourses();
      fetchAvailableSwaps();
    }
  }, [api, open, onError]);


  const handleSubmit = async (event) => {
      event.preventDefault();
      // Check if we have valid selected courses and swapId
      if (!selectedGivingCourse || !selectedWantedCourse || !swapId) {
        onError("Please select both giving and wanted courses and ensure swap ID is valid.");
        return;
      }
      
      try {
        const response = await api.post(`/edit_swap/${swapId}`, {
          newGivingCourseId: selectedGivingCourse.id,
          newWantedCourseId: selectedWantedCourse.course_id,
        });
        if (response.ok) {
          onSuccess("Swap updated successfully");
          handleClose();
        } else {
          onError('Failed to update swap');
        }
      } catch (error) {
        onError('An error occurred while updating the swap');
      }
    };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
      <DialogTitle>Edit Swap</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Autocomplete
            options={myCourses}
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            value={selectedGivingCourse}
            onChange={(event, newValue) => setSelectedGivingCourse(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Giving Course" margin="dense" variant="outlined" fullWidth />
            )}
          />
          <Autocomplete
            options={availableCourses}
            getOptionLabel={(option) => `${option.course_code} - ${option.course_name}`}
            value={selectedWantedCourse}
            onChange={(event, newValue) => setSelectedWantedCourse(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Wanted Course" margin="dense" variant="outlined" fullWidth />
            )}
          />
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSwapForm;
