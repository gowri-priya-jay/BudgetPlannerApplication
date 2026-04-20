import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import YearlyIcon from "@mui/icons-material/AssessmentRounded";
import AverageIcon from "@mui/icons-material/EqualizerRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IncomeIcon from "@mui/icons-material/ArrowUpwardRounded";
import ExpenseIcon from "@mui/icons-material/ArrowDownwardRounded";
import SavingsIcon from "@mui/icons-material/SavingsRounded";

const AnnualInsightCard = ({ data }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Yearly Overview Card */}
      <Card sx={{ mr: 1, minWidth: "225px", height: "100px" }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <YearlyIcon color="primary" />
              <Typography fontWeight={600}>Yearly Totals</Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={1}>
            <Grid size={7}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IncomeIcon fontSize="12px" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Total Income</Typography>
              </Box>
            </Grid>
            <Grid size={1}>
              <Typography variant="body2">:</Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                ${Number(data.totalIncome).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid size={7}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ExpenseIcon fontSize="12px" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Total Expense</Typography>
              </Box>
            </Grid>
            <Grid size={1}>
              <Typography variant="body2">:</Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                ${Number(data.totalExpense).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid size={7}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SavingsIcon fontSize="12px" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Total Savings</Typography>
              </Box>
            </Grid>
            <Grid size={1}>
              <Typography variant="body2">:</Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                ${Number(data.totalSavings).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Monthly Averages card */}
      <Card sx={{ mr: 1, minWidth: "225px", height: "100px" }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AverageIcon color="primary" />
              <Typography fontWeight={600}>Monthly Averages</Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={0.5}>
            <Grid size={7}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IncomeIcon fontSize="12px" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Average Income</Typography>
              </Box>
            </Grid>
            <Grid size={1}>
              <Typography variant="body2">:</Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                ${Number(data.avgMonthlyIncome).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={0.5}>
            <Grid size={7}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ExpenseIcon fontSize="12px" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Average Expense</Typography>
              </Box>
            </Grid>
            <Grid size={1}>
              <Typography variant="body2">:</Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                ${Number(data.avgMonthlyExpense).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={0.5}>
            <Grid size={7}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SavingsIcon fontSize="12px" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Average Savings</Typography>
              </Box>
            </Grid>
            <Grid size={1}>
              <Typography variant="body2">:</Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                ${Number(data.avgMonthlySavings).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Spending Insights */}
      <Card sx={{ mr: 1, minWidth: "225px", height: "100px" }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InsightsRoundedIcon color="primary" />
              <Typography fontWeight={600}>Spending Insights</Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={0.5}>
            <Grid size={8}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Overspent Months
                </Typography>
                <Tooltip
                  title="A month is considered overspent when actual savings are below $1500."
                  arrow
                  placement="top"
                >
                  <InfoOutlinedIcon
                    sx={{ fontSize: "10px", color: "#6b7a86" }}
                  />
                </Tooltip>
              </Box>
            </Grid>
            <Grid size={0.5}>
              <Typography variant="body2">:</Typography>
            </Grid>
            <Grid size={3.5}>
              <Typography variant="body2">{data.overspentMonths}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={0.5} sx={{ mt: 1 }}>
            <Grid size={8}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  UnderSpent Months
                </Typography>
                <Tooltip
                  title="A month is considered underspent when actual savings are above $2500."
                  arrow
                  placement="top"
                >
                  <InfoOutlinedIcon
                    sx={{ fontSize: "10px", color: "#6b7a86" }}
                  />
                </Tooltip>
              </Box>
            </Grid>
            <Grid size={0.5}>
              <Typography variant="body2">:</Typography>
            </Grid>
            <Grid size={3.5}>
              <Typography variant="body2">{data.underBudgetMonths}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Month names */}
      <Card sx={{ minWidth: "275px", height: "100px" }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InsightsRoundedIcon color="primary" />
              <Typography fontWeight={600}>Spending Insights</Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={0.5} alignItems="center">
            <Grid size={7}>
              <Typography variant="body2">Highest Spending Month</Typography>
            </Grid>
            <Grid size={0.5}>
              <Typography variant="body2">:</Typography>
            </Grid>
            <Grid size={4.5}>
              <Chip
                size="small"
                label={data.highestSpendingMonth}
                sx={{
                  padding: "4px",
                  height: "20px",
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={0.5} sx={{ mt: 1 }} alignItems="center">
            <Grid size={7}>
              <Typography variant="body2">Lowest Spending Month</Typography>
            </Grid>
            <Grid size={0.5}>
              <Typography variant="body2">:</Typography>
            </Grid>
            <Grid size={4.5}>
              <Chip
                size="small"
                label={data.lowestSpendingMonth}
                sx={{
                  padding: "4px",
                  height: "20px",
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnnualInsightCard;
