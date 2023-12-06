import React from "react";
import Box from "@mui/material/Box";
import PickupComponent from "./PickupComponent";
import Typography from "@mui/material/Typography";

const PickupCourseItem = ({ code, title, count, courseId}) => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        minWidth: 275,
        marginBottom: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="subtitle1">{code}: {title}</Typography>
        <Typography variant="subtitle2">Available: {count}</Typography>
      </Box>
      <PickupComponent courseId={courseId}/>
    </Box>
  );
};

export default PickupCourseItem;
