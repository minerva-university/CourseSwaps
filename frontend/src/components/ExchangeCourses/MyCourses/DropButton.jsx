import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";

const DropCourseButton = ({ courseName }) => {
  const [openDialog, setOpenDialog] = useState(false); // State to handle dialog open/close
  const [confirmed, setConfirmed] = useState(false); // State to track confirmation

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    console.log(`Course ${courseName} confirmed for drop.`);
    // Perform the drop logic here
    setOpenDialog(false);
    setConfirmed(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Drop Course button */}
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpenDialog}
        startIcon={<DeleteIcon />} // Add the Delete icon as the start icon
        disabled={confirmed} // Disable the button if already confirmed
      >
        {confirmed ? "Dropped" : "Drop"}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Drop</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to drop {courseName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {!confirmed && (
            <Button
              onClick={handleConfirm}
              color="secondary"
              sx={{ color: "black" }} // Set the text color to black
            >
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DropCourseButton;
