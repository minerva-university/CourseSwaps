import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import SwapItem from "./SwapItem";
import Typography from "@mui/material/Typography";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from "@mui/material/Alert";
import { useApi } from "../../../contexts/ApiProvider";
import { useRefresh } from "../../../contexts/useRefresh";
import { usePeriodicRefresh } from "../../../contexts/usePeriodicRefresh";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MyPreferredSwapsList = () => {
  const [swaps, setSwaps] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const api = useApi();
  const { refreshKey } = useRefresh();
  const { subscribe, unsubscribe } = usePeriodicRefresh();
  

  const fetchSwaps = useCallback(async () => {
    try {
      const response = await api.get('/my_swaps');
      if (response.ok && response.status === 200) {
        setSwaps(response.body.my_swaps);
      } else {
        console.error('Failed to fetch swaps', response);
        setSnackbarMessage('Failed to fetch swaps');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error fetching swaps:', error);
      setSnackbarMessage('Error fetching swaps');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }, [api]);

  useEffect(() => {
      fetchSwaps();
    }, [fetchSwaps, refreshKey]);
  
    useEffect(() => {
      subscribe(fetchSwaps);
      return () => {
        unsubscribe(fetchSwaps);
      };
    }, [subscribe, unsubscribe, fetchSwaps]);
  
    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackbar(false);
    };
  
    const removeSwapFromState = (deletedSwapId) => {
      setSwaps(currentSwaps => currentSwaps.filter(swap => swap.swap_id !== deletedSwapId));
    };

    const refreshSwaps = () => {
      fetchSwaps();
    };
  
    return (
      <Box
        sx={{
          width: '100%', // Set a default width for all screen sizes
          bgcolor: "#f0f0f0",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          '@media (min-width: 768px)': {
            maxWidth: "360px", // Set a fixed width for larger devices (adjust the breakpoint and width as needed)
          },
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
            textAlign: "center",
            color: "#333",
          }}
        >
          My preferred swaps
        </Typography>
        {swaps.map((swap) => (
          <SwapItem
            key={swap.swap_id}
            swapId={swap.swap_id}
            givingCourse={swap.giving_course}
            wantedCourse={swap.wanted_course}
            setOpenSnackbar={setOpenSnackbar}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
            onSwapDeleted={removeSwapFromState}
            refreshSwaps={refreshSwaps}
          />
        ))}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    );
  };
  
  export default MyPreferredSwapsList;
