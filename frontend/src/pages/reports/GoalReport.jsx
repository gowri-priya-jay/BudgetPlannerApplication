import React, { useState } from "react";
import { Box, Divider, Typography, Select, MenuItem } from "@mui/material";
import GoalAllocationReport from "../goals/GoalAllocationReport";
import GoalActivity from "../goals/GoalActivity";
import LeftAlignedLabel from "../../components/LeftAlignedLabel";

export default function GoalReport() {
  const [reportType, setReportType] = useState("");

  return (
    <Box>
      <Typography variant="h6" fontWeight={600}>
        Goal Report
      </Typography>
      <Divider flexItem sx={{ my: 1 }} />
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <LeftAlignedLabel>Goal Report Type</LeftAlignedLabel>
        <Select
          size="small"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          displayEmpty
          sx={{ minWidth: 250, maxWidth: 250, marginTop: 0 }}
        >
          <MenuItem value="" disabled>
            Select Report Type
          </MenuItem>
          <MenuItem value="GOAL_ALLOCATION">Goal Allocation Report</MenuItem>
          <MenuItem value="GOAL_ACTIVITY">Goal Activity Report</MenuItem>
        </Select>
      </Box>

      <Box sx={{ mt: 2 }}>
        {reportType === "GOAL_ALLOCATION" && <GoalAllocationReport />}

        {reportType === "GOAL_ACTIVITY" && <GoalActivity />}
      </Box>
    </Box>
  );
}
