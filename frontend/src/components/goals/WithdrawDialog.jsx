import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Paper,
  Typography,
  Grid,
  Box,
  TextField,
  Divider,
  Button,
} from "@mui/material";

import API from "../../services/api";
import GoalIcon from "@mui/icons-material/FlagCircleRounded";
import LeftAlignedLabel from "../LeftAlignedLabel";
import MoneyInput from "../common/MoneyInput";

export default function WithdrawDialog({ open, onClose, goalId, onSaved }) {
  const [goal, setGoal] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [amountError, setAmountError] = useState("");
  const [notesError, setNotesError] = useState("");

  // Load goal details
  useEffect(() => {
    const loadGoal = async () => {
      setGoal(null);
      setTransferAmount("");
      setNotes("");
      setAmountError("");
      setNotesError("");

      if (!goalId) return;
      try {
        const res = await API.get(`/goal/getGoal/${goalId}`);
        setGoal(res.data);
      } catch (err) {
        console.error("Failed to load goal details", err);
      }
    };

    if (open) loadGoal();
  }, [open, goalId]);

  const handleSave = async () => {
    let valid = true;
    if (!transferAmount) {
      setAmountError("Enter amount to be withdrawn");
      valid = false;
    }
    if (transferAmount > goal.savedAmount) {
      setAmountError("Withdrawal amount is greater than saved amount");
      valid = false;
    }
    if (!notes) {
      setNotesError("Enter Description");
      valid = false;
    }
    if (!valid) return;

    const payload = {
      goalId: goalId,
      amount: transferAmount,
      notes: notes,
    };
    console.log(payload);
    try {
      await API.post("/goal/withdrawAmount", payload);
      onClose();
      onSaved();
    } catch (err) {
      console.error("Failed to transfer goal amaount", err);
    }
  };

  if (!goal) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <GoalIcon />
        Withdraw Goal Amount
      </DialogTitle>
      <DialogContent sx={{ mb: 1 }}>
        <Paper
          elevation={1}
          sx={{ p: 1, background: "linear-gradient(135deg, #e3f2fd, #f1f8ff)" }}
        >
          <Grid container spacing={1}>
            <Grid size={3}>
              <Typography variant="subtitle1">Goal Name</Typography>
            </Grid>
            <Grid size={0.5}>
              <Typography variant="subtitle1">:</Typography>
            </Grid>
            <Grid size={8.5}>
              <Typography variant="subtitle1" fontWeight={600}>
                {goal.goalName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid size={3}>
              <Typography variant="subtitle1">Saved Amount</Typography>
            </Grid>
            <Grid size={0.5}>
              <Typography variant="subtitle1">:</Typography>
            </Grid>
            <Grid size={8.5}>
              <Typography variant="subtitle1" fontWeight={600}>
                ${Number(goal.savedAmount).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={1} sx={{ mt: 2, alignItems: "center" }}>
          <Grid size={3}>
            <LeftAlignedLabel required>Withdraw Amount</LeftAlignedLabel>
          </Grid>
          <Grid size={7}>
            <MoneyInput
              fullWidth
              value={transferAmount}
              onChange={(val) => {
                setTransferAmount(val);
                setAmountError("");
              }}
              error={Boolean(amountError)}
              helperText={amountError}
              sx={{ marginTop: 0 }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: 1, alignItems: "center" }}>
          <Grid size={3}>
            <LeftAlignedLabel required>Description</LeftAlignedLabel>
          </Grid>
          <Grid size={7}>
            <TextField
              fullWidth
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setNotesError("");
              }}
              error={Boolean(notesError)}
              helperText={notesError}
              sx={{ marginTop: 0 }}
            />
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
