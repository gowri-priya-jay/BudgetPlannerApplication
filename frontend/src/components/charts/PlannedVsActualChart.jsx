import { Typography } from "@mui/material";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PlannedVsActualChart = ({ budget }) => {
  const data = [
    {
      name: "Income",
      Planned: budget.totalPlannedIncome,
      Actual: budget.totalIncome,
    },
    {
      name: "Expense",
      Planned: budget.totalPlannedExpense,
      Actual: budget.totalExpense,
    },
    {
      name: "Savings",
      Planned: budget.plannedSavings,
      Actual: budget.actualSavings,
    },
  ];

  return (
    <>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Planned vs Actual
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 1, right: 0, left: -20, bottom: 0 }}
          barSize={20}
          barCategoryGap="10%"
          barGap={5}
        >
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#375462" }}  interval={0} />
          <YAxis tick={{ fontSize: 10, fill: "#375462" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #d0d0d0",
              color: "#375462",
            }}
            labelStyle={{ fontSize: 10, color: "#375462" }}
            itemStyle={{ fontSize: 10, color: "#375462" }}
          />

          <Bar dataKey="Planned" fill="#cde1ea" stroke="none" />
          <Bar dataKey="Actual" fill="#375462" stroke="none" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default PlannedVsActualChart;
