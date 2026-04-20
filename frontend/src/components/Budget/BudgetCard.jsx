import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Chip,
  CardContent,
  LinearProgress,
  CardActionArea,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import IncomeIcon from "@mui/icons-material/ArrowUpwardRounded";
import ExpenseIcon from "@mui/icons-material/ArrowDownwardRounded";
import SavingsIcon from "@mui/icons-material/Savings";

const BudgetCard = ({
  budget,
  onView,
  onEdit,
  onDelete,
  onAllocate,
  onReallocate,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    month,
    year,
    totalIncome,
    totalExpense,
    actualSavings,
    allocatedAmount,
    allocationStatus,
  } = budget;

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const STATUS_COLORS = {
    Allocated: "#00a506",
    "Needs Reallocation": "#ffab2e",
    "Not Allocated": "#e9666e",
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined) return "0.00";
    return Number(value).toFixed(2);
  };

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PaymentRoundedIcon color="primary" />
            <Typography fontWeight={600} fontSize={12}>
              {month} {year}
            </Typography>
          </Box>
        }
        action={
          <IconButton onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
        }
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={() => onView(budget)}>View budget</MenuItem>
        <MenuItem onClick={() => onEdit(budget)}>Edit budget</MenuItem>
        <MenuItem onClick={() => onDelete(budget)} sx={{ color: "red" }}>Delete budget</MenuItem>
      </Menu>

      {/* ---------- SUMMARY GRID ---------- */}
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1}}>
              <IncomeIcon sx={{ fontSize: "12px", mr: "4px" }} />
              <Typography fontSize={12}>Income</Typography>
            </Box>
            <Typography fontSize={12} fontWeight="bold" color="text.secondary">
              ${formatMoney(totalIncome)}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          {/* Expense */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1}}>
              <ExpenseIcon sx={{ fontSize: "12px", mr: "4px" }} />
              <Typography fontSize={12}>Expense</Typography>
            </Box>
            <Typography fontSize={12} fontWeight="bold" color="text.secondary">
              ${formatMoney(totalExpense)}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          {/* Savings */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <SavingsIcon sx={{ fontSize: "12px", mr: "4px" }} />
              <Typography fontSize={12}>Savings</Typography>
            </Box>
            <Typography fontSize={12} fontWeight="bold" color="text.secondary">
               ${formatMoney(actualSavings)}
            </Typography>
          </Box>
        </Box>
        <Divider flexItem sx={{ mt: 1 }}/>
        {/* ---------- ALLOCATION DETAILS ---------- */}
        <Box sx={{ mt: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography fontSize={12} fontWeight={600}>
              Allocation:
            </Typography>
            <Chip
              size="small"
              label={allocationStatus}
              sx={{
                height: "20px",
                backgroundColor: STATUS_COLORS[allocationStatus],
                color: "white",
                fontSize: "10px",
                ml: 2,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Box sx={{ mr: 2, width: "100%" }}>
              <LinearProgress
                variant="determinate"
                value={(allocatedAmount / actualSavings) * 100}
                sx={{ height: 5 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                {allocatedAmount > 0
                  ? `${((allocatedAmount / actualSavings) * 100).toFixed(0)}% Allocated`
                  : "0% Allocated"}{" "}
              </Typography>
              
            </Box>
            {allocationStatus === "Not Allocated" ? (
              <Button
                variant="contained"
                onClick={() => onAllocate(budget)}
                sx={{ fontSize: "10px" }}
              >
                Allocate
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => onReallocate(budget)}
                sx={{ fontSize: "10px" }}
              >
                Reallocate
              </Button>
            )}
          </Box>
          <Typography fontSize={10} color="text.secondary">( ${allocatedAmount} / ${actualSavings} )</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
