import { Box, Typography, LinearProgress } from "@mui/material";

export default function GoalProgressBar({ saved, target }) {
  const percentage = (saved / target) * 100;

  const cappedPercentage = Math.min(percentage, 100);

  return (
    <Box>
      {/* Base progress bar (0–100%) */}
      <LinearProgress
        variant="determinate"
        value={cappedPercentage}
        sx={{
          height: 5,
          borderRadius: 5,
          backgroundColor: "#d0e7e7",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#00796b", 
          },
        }}
      />
      <Typography variant="caption">{cappedPercentage.toFixed(0)}%</Typography>
    </Box>
  );
}