import React from "react";
import Box from "@mui/material/Box";

const PickupCourseItem = ({ title }) => {
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
      {title}
    </Box>
  );
};

export default PickupCourseItem;
