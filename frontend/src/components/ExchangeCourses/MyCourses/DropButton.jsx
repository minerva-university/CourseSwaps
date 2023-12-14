import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useApi } from "../../../contexts/ApiProvider";
import { useRefresh } from "../../../contexts/useRefresh";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DropCourseButton = ({ courseName, courseId ,checkCourse,course}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const api = useApi();
  const { triggerRefresh } = useRefresh();

  const handleOpenDialog =  async () => {
    const canDelete = await checkCourse(course);
    if (canDelete){
      setOpenDialog(true);
    }else{
      setSnackbarMessage(
        "You cannot swap this course because it is not in your current courses."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
       triggerRefresh();
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await api.post("/dropcourse", { courseId });
      console.log(response)
      if (response.ok) {
        setSnackbarMessage(response.body.message);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        triggerRefresh();
      } else {
        setSnackbarMessage(response.body.error);
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage(`Error dropping course ${courseName}: ${error}`);
      setSnackbarSeverity("error");
    }
    console.log('Closing dialog');
    setOpenSnackbar(true);
    triggerRefresh();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    console.log('Closing snackbar');
    setOpenSnackbar(false);
    setSnackbarMessage('');
    setSnackbarSeverity('info');
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpenDialog}
        startIcon={<DeleteIcon />}
      >
        Drop
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Drop</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to drop {courseName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DropCourseButton;
