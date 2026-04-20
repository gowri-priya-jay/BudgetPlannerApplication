import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

const SavingsGoalChart = ({ allocations }) => {
  const hasAllocations = allocations && allocations.length > 0;

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Saving Goal Allocation
      </Typography>

      {/* EMPTY STATE */}
      {!hasAllocations && (
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: "#f5f7f8",
            border: "1px dashed #c3c7c9",
            textAlign: "center",
          }}
        >
          <Typography fontSize={14} color="#375462">
            No savings allocated for this budget yet.
          </Typography>
        </Box>
      )}

      {/* ALLOCATIONS LIST */}
      {hasAllocations &&
        allocations.map((a) => (
          <Box
            key={a.allocationId}
            sx={{
              mb: 2,
              p: 1,
              borderRadius: 2,
              backgroundColor: "#f7fafb",
              border: "1px solid #e1e6e8",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontSize={14} fontWeight={600} color="#375462">
                {a.goalName}
              </Typography>
              <Typography fontSize={14} fontWeight={600} color="#375462">
                ${a.allocatedAmount}
              </Typography>
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default SavingsGoalChart;