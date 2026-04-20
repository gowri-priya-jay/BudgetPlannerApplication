import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import {
  Grid,
  Paper,
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import GoalIcon from "@mui/icons-material/FlagCircleRounded";
import LeftAlignedLabel from "../LeftAlignedLabel";
import API from "../../services/api";
import MoneyInput from "../common/MoneyInput";

export default function GoalTransferDialog({ open, onClose, goalId, onSaved }) {
  const [goal, setGoal] = useState(null);
  const [goalsList, setGoalsList] = useState(null);
  const [toGoalId, setToGoalId] = useState("");
  const [transferAmount, setTransferAmount] = useState(null);
  const [goalError, setGoalError] = useState("");
  const [amountError, setAmountError] = useState("");

  // Load goal details
  useEffect(() => {
    const loadGoal = async () => {
      setGoal(null);
      setGoalsList(null);
      setToGoalId("");
      setTransferAmount(null);
      setGoalError("");
      setAmountError("");
      if (!goalId) return;
      try {
        const res = await API.get(`/goal/getGoal/${goalId}`);
        setGoal(res.data);
        const list = await API.get(`/goal/getAllGoals`);
        setGoalsList(list.data);
      } catch (err) {
        console.error("Failed to load goal details", err);
      }
    };

    if (open) {
      loadGoal();
    }
  }, [open, goalId]);

  const handleSave = async () => {
    setGoalError("");
    setAmountError("");
    let valid = true;

    if (!toGoalId) {
      setGoalError("Goal is required");
      valid = false;
    }
    if (toGoalId == goalId) {
      setGoalError("Cannot not transfer to same goal");
      valid = false;
    }
    if (!transferAmount) {
      setAmountError("Transfer Amount is required");
      valid = false;
    }

    if (transferAmount > goal.savedAmount) {
      setAmountError("Transfer Amount is greater than saved amount");
      valid = false;
    }

    if (!valid) return;

    const payload = {
      fromGoal: goalId,
      toGoal: toGoalId,
      amount: transferAmount,
    };

    try {
      await API.post("/goal/transferAmount", payload);
      onClose();
      onSaved();
    } catch (err) {
      console.error("Failed to transfer goal amaount", err);
    }
  };

  if (!goal || !goalsList) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <GoalIcon />
        Transfer Goal Amount
      </DialogTitle>
      <DialogContent sx={{ mb: 1 }}>
        <Grid container spacing={1}>
          <Grid size={6}>
            <Box>
              <Typography variant="subtitle1">From Goal</Typography>
              <Paper elevation={1} sx={{ p: 1 }}>
                <LeftAlignedLabel>Goal Name</LeftAlignedLabel>
                <TextField
                  value={goal.goalName}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                    },
                  }}
                  sx={{ mb: 1 }}
                />
                <LeftAlignedLabel>Saved Amount</LeftAlignedLabel>
                <TextField
                  value={goal.savedAmount}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                    },
                  }}
                />
              </Paper>
            </Box>
          </Grid>
          <Grid size={6}>
            <Box>
              <Typography variant="subtitle1">To Goal</Typography>
              <Paper elevation={1} sx={{ p: 1 }}>
                <LeftAlignedLabel>Goal</LeftAlignedLabel>
                <TextField
                  fullWidth
                  select
                  value={toGoalId}
                  onChange={(e) => {
                    setToGoalId(e.target.value);
                    setGoalError("");
                  }}
                  slotProps={{
                    select: {
                      displayEmpty: true,
                    },
                  }}
                  error={Boolean(goalError)}
                  helperText={goalError}
                  sx={{ mb: 1 }}
                >
                  <MenuItem value="" disabled>
                    Select Goal
                  </MenuItem>
                  {goalsList.map((goal) => (
                    <MenuItem key={goal.goalId} value={goal.goalId}>
                      {goal.goalName}
                    </MenuItem>
                  ))}
                </TextField>
                <LeftAlignedLabel>Amount to be Transferred</LeftAlignedLabel>
                <MoneyInput
                  fullWidth
                  value={transferAmount}
                  onChange={(val) => {
                    setTransferAmount(val);
                    setAmountError("");
                  }}
                  error={Boolean(amountError)}
                  helperText={amountError}
                  sx={{ mt: 1 }}
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider flexItem />
      <DialogActions>
        <Button fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button fullWidth variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
