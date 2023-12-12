import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Snackbar, CircularProgress, Divider, Button, Dialog,
  DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useApi } from '../../../contexts/ApiProvider';
import { useRefresh } from '../../../contexts/useRefresh';
import { usePeriodicRefresh } from '../../../contexts/usePeriodicRefresh';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const SwapList = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);

  const api = useApi();
  const { refreshKey, triggerRefresh } = useRefresh();
  const { subscribe, unsubscribe } = usePeriodicRefresh();

  const fetchSwaps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/availableswaps');
      if (response.ok && response.status === 200) {
        setSwaps(response.body.available_swaps || []);
      } else {
        console.error('Failed to fetch swaps', response);
        setError('Failed to fetch swap data.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error fetching swaps:', error);
      setError('An error occurred while fetching swaps.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchSwaps();
  }, [fetchSwaps, refreshKey]);

  useEffect(() => {
    subscribe(fetchSwaps);
    return () => unsubscribe(fetchSwaps);
  }, [subscribe, unsubscribe, fetchSwaps]);

  const handleSwap = (swap) => {
    setSelectedSwap(swap);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSwap = async () => {
    console.log(`Confirmed swap for ID: ${selectedSwap}`);
    setConfirmDialogOpen(false);

    try {
      const response = await api.post("/confirm_swap", { selectedSwap });
      if (response.ok) {
        triggerRefresh();
        setSuccessMessage('Swap confirmed successfully');
        setOpenSuccessSnackbar(true);
      } else {
        setError(response.body.error || 'Error confirming swap');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setError('An error occurred during the swap');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setOpenSuccessSnackbar(false);
  };
  


  const ConfirmationDialog = () => (
    <Dialog
      open={confirmDialogOpen}
      onClose={() => setConfirmDialogOpen(false)}
    >
      <DialogTitle>Confirm Swap</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to make this swap?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirmSwap}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box
      sx={{
        maxWidth: 360,
        bgcolor: '#f0f0f0',
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 'bold',
          marginBottom: 2,
          textAlign: 'center',
          color: '#333',
        }}
      >
        Swap Courses
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Snackbar for error messages */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>

          {/* Snackbar for success messages */}
          <Snackbar
            open={openSuccessSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              {successMessage}
            </Alert>
          </Snackbar>
          {swaps.length === 0 ? (
            <Typography
              sx={{
                textAlign: 'center',
                color: '#666',
              }}
            >
              No available swaps
            </Typography>
          ) : (
            swaps.map((swap, index) => (
              <Box
                key={swap.swap_id}
                sx={{
                  backgroundColor: "white",
                  marginBottom: 2,
                  borderRadius: 2,
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Typography variant="body1">
                  <span style={{ fontWeight: 900 }}>Swap ID:</span> {swap.swap_id}
                </Typography>
                <Typography variant="body1">
                  <span style={{ fontWeight: 900 }}>Gives:</span> {swap.giving_course_code}: {swap.giving_course_name}
                </Typography>
                <Typography variant="body1">
                  <span style={{ fontWeight: 900 }}>Wants:</span> {swap.wanted_course_code}: {swap.wanted_course_name}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<SwapHorizIcon />}
                  sx={{ mt: 1, alignSelf: 'center' }}
                  onClick={() => handleSwap(swap.swap_id)}
                >
                  Make Swap
                </Button>
                {index !== swaps.length - 1 && <Divider />}
              </Box>
            ))
          )}
          <ConfirmationDialog />
        </>
      )}
    </Box>
  );
};

export default SwapList;
