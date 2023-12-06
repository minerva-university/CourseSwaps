import React from "react";
import Box from "@mui/material/Box";

const CourseToSwapItem = ({ username, givesCourse, wantsCourse }) => {
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
      {username}<br></br>Gives: {givesCourse.code}: {givesCourse.title} at {givesCourse.time}<br></br>Wants: {wantsCourse.code}: {wantsCourse.title} at {wantsCourse.time}
    </Box>
  );
};

export default CourseToSwapItem;
