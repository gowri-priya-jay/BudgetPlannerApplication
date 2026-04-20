import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import API from "../../services/api";

const CATEGORY_COLORS = {
  Home: "#cde1ea",
  Food: "#89b7c2",
  Shopping: "#9ecbd0",
  Entertainment: "#7aa8b7",
  Medical: "#4a90a4",
  Transport: "#6fa3b8",
  Subscription: "#b5dfe5",
  Others: "#e9666e",
  Savings: "#375462",
};

export default function ExpensePieChart({ budget }) {
  const [categoryTotals, setCategoryTotals] = useState([]);

  // Fetch category totals for this budget
  useEffect(() => {
    if (!budget?.budgetId) return;

    API.get(`/budget/getBudgetBreakdown/${budget.budgetId}`)
      .then((res) => setCategoryTotals(res.data))
      .catch((err) => console.error("Error fetching category totals", err));
  }, [budget]);

  if (!budget || categoryTotals.length === 0) return null;

  const income = budget.totalIncome;
  const savings = budget.actualSavings;

  // Build pie chart data
  const pieData = [
    ...categoryTotals.map((ct) => ({
      name: ct.categoryName,
      value: ct.total,
      percentage: ((ct.total / income) * 100).toFixed(1),
      color: CATEGORY_COLORS[ct.categoryName] || "#aacfd9",
    })),
    {
      name: "Savings",
      value: savings,
      percentage: ((savings / income) * 100).toFixed(1),
      color: CATEGORY_COLORS["Savings"],
    },
  ];

  return (
    <>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Budget Breakdown
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* PIE CHART */}
        <Box sx={{ width: "55%", height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                labelLine={false}
                label={false}
                minAngle={3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              {/* CENTER LABELS INSIDE SVG (FIXES TOOLTIP OVERLAP) */}
              <text
                x="50%"
                y="40%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: "10px", fill: "#375462" }}
              >
                Income
              </text>

              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: "12px", fontWeight: 700, fill: "#375462" }}
              >
                {income}
              </text>

              <text
                x="50%"
                y="56%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: "10px", fill: "#375462" }}
              >
                Savings
              </text>

              <text
                x="50%"
                y="64%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: "12px", fontWeight: 700, fill: "#375462" }}
              >
                {savings}
              </text>

              {/* SMALLER TOOLTIP */}
              <Tooltip
                formatter={(value, name, props) => {
                  const pct = props.payload.percentage;
                  return [`${value} (${pct}%)`, name];
                }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d0d0",
                  fontSize: "10px",
                  padding: "4px 6px",
                }}
                itemStyle={{ color: "#375462", fontSize: "10px" }}
                labelStyle={{ color: "#375462", fontSize: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* LEGEND */}
        <Box sx={{ width: "45%", alignContent: "center", ml: 0.5 }}>
          {pieData.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  mr: 1,
                }}
              />
              <Typography sx={{ fontSize: "10px", color: "#375462" }}>
                {item.name} — {item.percentage}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
