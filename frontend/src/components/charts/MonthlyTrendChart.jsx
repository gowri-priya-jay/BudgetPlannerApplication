import { useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const MonthlyTrendChart = ({ data }) => {

  const chartRef = useRef(null);

  if (!data || data.length === 0) return null;

  return (
    <div ref={chartRef} id="monthly-trend-chart">
    <Paper
      elevation={0}
      sx={{
        p: 1,
        borderRadius: 2,
        border: "1px solid #e1e6e8",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ color: "#375462" }}
      >
        Monthly Income, Expense & Savings
      </Typography>

      <Box sx={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5eaef" />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              padding={{ left: 20, right: 20 }} 
            />

            <YAxis
              width={24}
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={["dataMin - 200", "dataMax + 200"]} 
            />

            <Tooltip
              contentStyle={{
                fontSize: "10px",
                borderRadius: "6px",
                border: "1px solid #d0d7de",
              }}
            />

            <Legend wrapperStyle={{ fontSize: 10 }} />

            <Line
              type="linear"
              dataKey="income"
              name="Income"
              stroke="#4caf50"
              strokeWidth={1}
              dot={{ r: 2, fill: "#4caf50" }}
              activeDot={{ r: 5 }}
            />

            <Line
              type="linear"
              dataKey="expense"
              name="Expense"
              stroke="#f44336"
              strokeWidth={1}
              dot={{ r: 2, fill: "#f44336" }}
              activeDot={{ r: 5 }}
            />

            <Line
              type="linear"
              dataKey="savings"
              name="Savings"
              stroke="#2196f3"
              strokeWidth={1}
              dot={{ r: 2, fill: "#2196f3" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
    </div>
  );
};

export default MonthlyTrendChart;
