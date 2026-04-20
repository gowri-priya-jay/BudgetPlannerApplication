import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const Topbar = () => {
  const userName = localStorage.getItem("fullname");

  return (
    <Box
      sx={{
        backgroundColor: "#cde1ea",
        p: 1,
        display: "flex",
        alignItems: "center"
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Welcome {userName}{" "}!
      </Typography>
      <Box sx={{ ml: "auto" }}>
        <Avatar sx={{ bgcolor: "primary.main", width: "25px", height: "25px" }}>
          {userName.charAt(0)}
        </Avatar>
      </Box>
    </Box>
  );
};

export default Topbar;
