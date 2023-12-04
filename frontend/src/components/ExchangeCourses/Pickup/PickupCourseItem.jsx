import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const PickupCourseItem = ({ code, title, count }) => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        minWidth: 275,
        marginBottom: 2,
      }}
    >
      {code}: {title}<br></br>Available: {count}
    </Box>
  );
};

export default PickupCourseItem;