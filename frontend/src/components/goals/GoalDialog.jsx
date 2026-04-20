import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Divider,
} from "@mui/material";
import GoalIcon from "@mui/icons-material/FlagCircle";
import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import LeftAlignedLabel from "../LeftAlignedLabel";
import MoneyInput from "../common/MoneyInput";

export default function GoalDialog({ open, onClose, editId, onSaved }) {
  const [goalName, setGoalName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [isExternal, setIsExternal] = useState(true);
  const [accounts, setAccounts] = useState([]);

  // Errors
  const [errorName, setErrorName] = useState("");
  const [errorTarget, setErrorTarget] = useState("");
  const [errorNoChange, setErrorNoChange] = useState("");

  // Track initial values for edit mode
  const [initialValues, setInitialValues] = useState(null);

  // Load accounts for dropdown
  const loadAccounts = async () => {
    try {
      const res = await API.get("/account/getAllAccounts");
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to load accounts", err);
    }
  };

  // Load goal data for edit
  const loadGoal = useCallback(async () => {
    if (!editId) return;
    try {
      const res = await API.get(`/goal/getGoal/${editId}`);
      const g = res.data;
      const snapshot = {
        goalName: g.goalName,
        accountId: g.accountId || "",
        targetAmount: g.targetAmount,
        isExternal: g.isExternal,
      };
      setGoalName(g.goalName);
      setAccountId(g.accountId);
      setTargetAmount(g.targetAmount);
      setIsExternal(g.isExternal);
      setInitialValues(snapshot);
    } catch (err) {
      console.error("Failed to load goal", err);
    }
  }, [editId]);

  // Reset when dialog opens/closes
  useEffect(() => {
    const load = async () => {
      if (open) {
        await loadAccounts();
        await loadGoal();
      } else {
        setGoalName("");
        setAccountId("");
        setTargetAmount("");
        setIsExternal(true);
        setInitialValues(null);
        setErrorName("");
        setErrorTarget("");
        setErrorNoChange("");
      }
    };
    load();
  }, [open, loadGoal]);

  // Detect if any field changed
  const hasChanges = () => {
    if (!initialValues) return true; // Add mode always allows save

    return (
      goalName !== initialValues.goalName ||
      accountId !== initialValues.accountId ||
      Number(targetAmount) !== Number(initialValues.targetAmount) ||
      isExternal !== initialValues.isExternal
    );
  };

  // Account change handler (Add mode only)
  const handleAccountChange = (value) => {
    setAccountId(value);
    if (!editId) {
      setIsExternal(value === "");
    }
  };
  // Save handler
  const handleSave = async () => {
    setErrorName("");
    setErrorTarget("");
    setErrorNoChange("");
    // Block save if no changes in edit mode
    if (editId && !hasChanges()) {
      setErrorNoChange(
        "No changes detected. Update at least one field before saving.",
      );
      return;
    }
    let valid = true;

    if (!goalName.trim()) {
      setErrorName("Goal name is required");
      valid = false;
    }

    if (!targetAmount || Number(targetAmount) <= 0) {
      setErrorTarget("Target amount must be greater than 0");
      valid = false;
    }

    if (!valid) return;

    const payload = {
      goalName,
      accountId: accountId || null,
      targetAmount: Number(targetAmount),
      isExternal,
    };

    try {
      if (editId) {
        await API.put(`/goal/updateGoal/${editId}`, payload);
      } else {
        await API.post("/goal/createGoal", payload);
      }
      onClose();
      onSaved();
    } catch (err) {
      console.error("Failed to save goal", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <GoalIcon />
        {editId ? "Edit Goal" : "Add Goal"}
      </DialogTitle>
      <DialogContent>
        {errorNoChange && (
          <Box sx={{ color: "error.main", mb: 1, fontSize: 14 }}>
            {errorNoChange}
          </Box>
        )}
        {/* Goal Name */}
        <LeftAlignedLabel required>Goal Name</LeftAlignedLabel>
        <TextField
          fullWidth
          value={goalName}
          onChange={(e) => {
            setGoalName(e.target.value);
            setErrorName("");
          }}
          error={Boolean(errorName)}
          helperText={errorName}
          sx={{ mt: 1, mb: 1 }}
        />
        {/* Account ID */}
        <LeftAlignedLabel>Account</LeftAlignedLabel>
        <TextField
          fullWidth
          select
          disabled={Boolean(editId)} // READ-ONLY IN EDIT MODE
          value={accountId}
          onChange={(e) => handleAccountChange(e.target.value)}
          sx={{ mt: 1, mb: 1 }}
        >
          <MenuItem value="">-- External Goal --</MenuItem>
          {accounts.map((a) => (
            <MenuItem key={a.accountId} value={a.accountId}>
              {a.accountName}
            </MenuItem>
          ))}
        </TextField>
        {/* Target Amount */}
        <LeftAlignedLabel required>Target Amount</LeftAlignedLabel>
        <MoneyInput
          fullWidth
          value={targetAmount}
          onChange={(val) => {
            setTargetAmount(val);
            setErrorTarget("");
          }}
          error={Boolean(errorTarget)}
          helperText={errorTarget}
          sx={{ mt: 1, mb: 1 }}
        />
        {/* isExternal Switch */}
        <LeftAlignedLabel sx={{ mb: 0 }}>External Transfer</LeftAlignedLabel>
        <FormControlLabel
          control={
            <Switch
              checked={isExternal}
              readOnly
              sx={{ pointerEvents: "none" }}
            />
          }
          label={isExternal ? "Yes" : "No"}
          sx={{ ml: 1, margin: 0 }}
        />
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
