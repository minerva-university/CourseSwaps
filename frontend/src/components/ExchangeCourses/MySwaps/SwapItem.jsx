import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useApi } from "../../../contexts/ApiProvider";

const SwapItem = ({
      swapId, givingCourse, wantedCourse,
      setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity,
      onSwapDeleted,
    }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const api = useApi();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await api.post(`/cancel_swap/${swapId}`);
      if (response.ok) {
        setSnackbarMessage("Swap cancelled successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        onSwapDeleted(swapId);
      } else {
        setSnackbarMessage('Failed to cancel swap');
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('An error occurred while cancelling the swap');
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
    setOpenDialog(false);
  };
  

  return (
    <Box
      sx={{
        marginBottom: 1,
        padding: 1,
        bgcolor: "#ffffff",
        borderRadius: 1,
        boxShadow: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography variant="subtitle2">
          <strong style={{ fontWeight: 900 }}>Giving:</strong>{" "}
          {givingCourse}
        </Typography>
        <Typography variant="subtitle2">
          <strong style={{ fontWeight: 900 }}>Wanted:</strong>{" "}
          {wantedCourse}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleOpenDialog}
          startIcon={<DeleteIcon />}
        >
          Drop
        </Button>
      </Box>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this swap?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SwapItem;
