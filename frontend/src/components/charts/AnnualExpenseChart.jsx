import { useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Box, Paper, Typography } from "@mui/material";

const COLORS = {
  Food: "#8BC34A",
  Home: "#4DB6AC",
  Shopping: "#9575CD",
  Transportation: "#4FC3F7",
  Entertainment: "#FFB74D",
  Medical: "#E57373",
  Subscription: "#64B5F6",
  Others: "#90A4AE",
  Savings: "#4CAF50", // green
};

const AnnualExpenseChart = ({ data, totalIncome, totalSavings }) => {

   const chartRef = useRef(null);

  if (!data || data.length === 0) return null;

  const chartData = data.map((item) => ({
    name: item.category,
    value: Number(item.amount),
    percentage: Number(item.percentage),
  }));

  return (
    <div ref={chartRef} id="annual-expense-chart">
    <Paper
      elevation={0}
      sx={{
        p: 1,
        borderRadius: 2,
        border: "1px solid #e1e6e8",
        gap: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        Annual Expense Breakdown
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Donut Chart */}
        <Box sx={{ width: "55%", height: 280, position: "relative" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                height={280}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={2}
                minAngle={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry.name] || "#ccc"} />
                ))}
              </Pie>
              {/* CENTER LABELS INSIDE SVG */}
              <text
                x="50%"
                y="40%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#6b7a86"
              >
                Total Income
              </text>

              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="700"
                fill="#375462"
              >
                ${totalIncome}
              </text>

              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#6b7a86"
              >
                Savings
              </text>

              <text
                x="50%"
                y="66%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="700"
                fill="#4CAF50"
              >
                ${totalSavings}
              </text>

              <Tooltip
                contentStyle={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d7de",
                }}
                formatter={(value, name, props) => [
                  `$${value.toFixed(2)}`,
                  `${props.payload.name} (${props.payload.percentage}%)`,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box sx={{ width: "45%", alignContent: "center", ml: 0.5 }}>
          {chartData.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "3px",
                  backgroundColor: COLORS[item.name] || "#ccc",
                  mr: 1,
                }}
              />
              <Typography fontSize={11} color="#375462">
                {item.name} — {item.percentage}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
    </div>
  );
};

export default AnnualExpenseChart;
