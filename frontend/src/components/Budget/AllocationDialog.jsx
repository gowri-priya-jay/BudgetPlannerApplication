import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  Grid,
  IconButton,
  Alert,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import MoneyInput from "../common/MoneyInput";

const AllocationDialog = ({ open, onClose, budget, goals = [], onSave }) => {
  const [rows, setRows] = useState([{ goalId: "", amount: "" }]);
  const [error, setError] = useState("");

  const totalSavings = budget?.actualSavings || 0;

  useEffect(() => {
    const load = async () => {
        if (open) {
            setRows([{ goalId: "", amount: "" }]);
            setError("");
        }
    };
    load();
  }, [open,budget]);

  const formatMoney = (value) => {
    if (value === null || value === undefined) return "0.00";
    return Number(value).toFixed(2);
  };

  const handleAddRow = () => {
    setRows([...rows, { goalId: "", amount: "" }]);
  };

  const handleDeleteRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
    setError("");
  };

  const validate = () => {
    // 3.1 At least one row must have amount > 0
    if (!rows.some((r) => Number(r.amount) > 0)) {
      return "At least one allocation must have an amount greater than zero.";
    }

    // 3.2 All rows must have goal + amount
    for (let r of rows) {
      if (!r.goalId || !r.amount) {
        return "All rows must have both goal and amount.";
      }
    }

    // 3.5 No duplicate goals
    const goalIds = rows.map((r) => r.goalId);
    const unique = new Set(goalIds);
    if (unique.size !== goalIds.length) {
      return "Duplicate goals are not allowed.";
    }

    // 3.3 Total allocation must not exceed savings
    const totalAllocated = rows.reduce((sum, r) => sum + Number(r.amount), 0);
    if (totalAllocated > totalSavings) {
      return "Total allocation cannot exceed total savings.";
    }

    return "";
  };

  const totalAllocated = rows.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0,
  );

  const remainingSavings = totalSavings - totalAllocated;

  const handleSubmit = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      budgetId: budget.budgetId,
      totalAllocated: totalAllocated,
      allocations: rows.map((r) => ({
        goalId: r.goalId,
        amount: Number(r.amount),
      })),
    };

    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}
      >
        <AccountBalanceWalletRoundedIcon
          color="primary"
          sx={{ fontSize: 20 }}
        />
        Allocate Savings
      </DialogTitle>

      <DialogContent>
        {/* Budget Header */}
        <Box sx={{ backgroundColor: "#617E8C", color: "white", p: 1 }}>
          <Typography fontWeight={600}>
            {budget?.month} {budget?.year}
          </Typography>
        </Box>

        {/* Budget Summary */}
        <Box
          sx={{
            mt: 1,
            mb: 1,
            background: "#f5f7ff",
            p: 0.5,
            borderRadius: 2,
            width: "50%",
          }}
        >
          <Grid container spacing={1}>
            <Grid size={5}>
              <Typography fontSize={12} fontWeight={600}>
                Total Savings
              </Typography>
            </Grid>
            <Grid size={1}>
              <Typography fontSize={12} fontWeight={600}>
                :
              </Typography>
            </Grid>
            <Grid size={5}>
              <Typography fontSize={12} fontWeight={600} color="text.secondary">
                ${formatMoney(totalSavings)}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid size={5}>
              <Typography fontSize={12} fontWeight={600}>
                Remaining
              </Typography>
            </Grid>
            <Grid size={1}>
              <Typography fontSize={12} fontWeight={600}>
                :
              </Typography>
            </Grid>
            <Grid size={5}>
              <Typography
                fontSize={12}
                fontWeight={600}
                color={remainingSavings < 0 ? "error" : "#43ae7a"}
              >
                ${formatMoney(remainingSavings)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}
        <Divider flexItem sx={{ mb: 1 }} />
        <Grid container spacing={1}>
          <Grid size={5}>
            <Typography>Goal</Typography>
          </Grid>
          <Grid size={5}>
            <Typography>Amount</Typography>
          </Grid>
        </Grid>
        {/* Allocation Rows */}
        {rows.map((row, index) => (
          <Grid
            container
            spacing={1}
            alignItems="center"
            key={index}
            sx={{ mb: 1 }}
          >
            <Grid size={5}>
              <TextField
                select
                placeholder="Goal Name"
                fullWidth
                value={row.goalId}
                onChange={(e) => handleChange(index, "goalId", e.target.value)}
                onFocus={() => setError("")}
              >
                {goals.map((g) => (
                  <MenuItem key={g.goalId} value={g.goalId}>
                    {g.goalName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={5}>
              <MoneyInput
                fullWidth
                size="small"
                value={row.amount}
                onChange={(val) => handleChange(index, "amount", val)}
                onBlur={(val) => handleChange(index, "amount", val)}
              />
            </Grid>

            <Grid size={1} sx={{ textAlign: "center" }}>
              {index === rows.length - 1 ? (
                <IconButton
                  onClick={handleAddRow}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: "#375462",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#8ac0de",
                    },
                  }}
                >
                  <AddCircleOutlineIcon sx={{ fontSize: 18 }} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => handleDeleteRow(index)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: "#ffe5e5",
                    color: "#e9666e",
                    "&:hover": {
                      backgroundColor: "#ffcccc",
                    },
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ fontSize: 12 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ fontSize: 12 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllocationDialog;
