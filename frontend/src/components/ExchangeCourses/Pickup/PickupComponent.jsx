import React, { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useApi } from "../../../contexts/ApiProvider";
import { useRefresh } from "../../../contexts/RefreshProvider";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PickupComponent = ({ courseId }) => {
  const api = useApi();
  const { triggerRefresh } = useRefresh();
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handlePickup = async () => {
    try {
      const response = await api.post('/pickupcourse', { courseId });
      if (response.ok) {
        setSnackbarMessage("Course successfully picked up");
        setSnackbarSeverity("success");
        setOpen(true);
      } else {
        setSnackbarMessage(response.body.error)
        setSnackbarSeverity("error");
        setOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error while picking up course");
      setSnackbarSeverity("error");
      setOpen(true);
    }
    triggerRefresh();

  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handlePickup}
        sx={{ marginTop: 2 }}
      >
        Take
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PickupComponent;
