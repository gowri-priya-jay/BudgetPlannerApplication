import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Grid,
  LinearProgress,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import GoalIcon from "@mui/icons-material/FlagCircleRounded";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import API from "../../services/api";
import LeftAlignedLabel from "../LeftAlignedLabel";
import MoneyInput from "../common/MoneyInput";

export default function GoalViewDialog({ open, onClose, goalId }) {
  const [goal, setGoal] = useState(null);
  // Load goal details
  useEffect(() => {
    const loadGoal = async () => {
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

  if (!goal) return null;

  const progress = Math.round((goal.savedAmount / goal.targetAmount) * 100);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <GoalIcon />
        Goal Details
      </DialogTitle>
      <DialogContent>
        {/* Goal Name */}
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
          sx={{ mb: 2 }}
        />
        {/* Amount Fields */}
        <Grid container spacing={2}>
          <Grid size={6}>
            <LeftAlignedLabel>Target Amount</LeftAlignedLabel>
            <TextField
              value={`$${goal.targetAmount.toLocaleString()}`}
              fullWidth
              InputProps={{
                readOnly: true,
                sx: {
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                },
              }}
            />
          </Grid>
          <Grid size={6}>
            <LeftAlignedLabel>Saved Amount</LeftAlignedLabel>
            <MoneyInput
              value={`${goal.savedAmount.toLocaleString()}`}
              fullWidth
              readOnly
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            />
            {/* <TextField
              value={`$${goal.savedAmount.toLocaleString()}`}
              fullWidth
              InputProps={{
                readOnly: true,
                sx: {
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                },
              }}
            /> */}
          </Grid>
        </Grid>

        {/* Chips Section */}
        <Box sx={{ display: "flex", gap: 1, mb: 1, mt: 1 }}>
          <Chip
            label={goal.isExternal ? "External Goal" : "Internal Goal"}
            color={goal.isExternal ? "warning" : "success"}
            variant="filled"
          />
          {progress === 100 && (
            <Chip
              icon={<CheckCircleIcon />}
              label="Completed"
              color="success"
              variant="filled"
            />
          )}
        </Box>

        {/* Account */}
        <LeftAlignedLabel>Account</LeftAlignedLabel>
        <TextField
          value={goal.accountId ? goal.accountName : "External Goal"}
          fullWidth
          InputProps={{
            readOnly: true,
            sx: {
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
            },
          }}
        />

        {/* Progress Section */}
        <Box
          sx={{
            mt: 1,
            p: 1,
            borderRadius: 2,
            background: "linear-gradient(135deg, #e3f2fd, #f1f8ff)",
          }}
        >
          <Typography variant="body2">Progress</Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 10, borderRadius: 5, mt: 1, mb: 1 }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SavingsIcon fontSize="small" color="primary" />
            {progress}% Completed
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button fullWidth variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
