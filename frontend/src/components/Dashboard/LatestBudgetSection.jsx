import React from "react";
import { Box, Typography, Grid, Paper, Divider } from "@mui/material";
import PlannedVsActualChart from "../charts/PlannedVsActualChart";
import ExpensePieChart from "../charts/ExpensePieChart";
import SavingsGoalChart from "../charts/SavingsGoalChart";

const LatestBudgetSection = ({ budget }) => {
  if (!budget) {
    return (
      <Typography fontSize={16} color="gray">
        No completed budget available
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{display: "flex"}}>
        <Typography variant="subtitle1">Budgeted Month :</Typography>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" ml={1}> {budget.month} {budget.year}</Typography>
      </Box>
      <Grid container spacing={1} sx={{ mt : 0.5}}>
        <Grid size={4}>
          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <PlannedVsActualChart budget={budget} />
          </Paper>
        </Grid>

        <Grid size={4}>
          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <ExpensePieChart budget={budget} />
          </Paper>
        </Grid>
        <Grid size={4}>
          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <SavingsGoalChart allocations={budget.allocations} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LatestBudgetSection;