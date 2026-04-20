import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useState, useEffect } from "react";
import LeftAlignedLabel from "../LeftAlignedLabel";
import MoneyInput from "../common/MoneyInput";
import API from "../../services/api";

export default function AddAccountDialog({ open, onClose, onSaved }) {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [cardColor, setCardColor] = useState("#0A7E8B");
  const [existingAccounts, setExistingAccounts] = useState([]);

  // Errors
  const [errorName, setErrorName] = useState("");
  const [errorType, setErrorType] = useState("");

  // Reset when dialog opens/closes
  useEffect(() => {
    const load = async () => {
      if (open) {
        try {
          const res = await API.get("/account/getAllAccounts");
          setExistingAccounts(res.data);
        } catch (err) {
          console.error("Failed to load accounts", err);
        }
      } else {
        setAccountName("");
        setAccountType("");
        setCurrentBalance("");
        setCardColor("#0A7E8B");
        setErrorName("");
        setErrorType("");
      }
    };
    load();
  }, [open]);

  const handleSave = async () => {
    setErrorName("");
    setErrorType("");

    let valid = true;

    if (!accountName.trim()) {
      setErrorName("Account name is required");
      valid = false;
    }

    if (!accountType.trim()) {
      setErrorType("Account type is required");
      valid = false;
    }

    // Duplicate check
    const isDuplicate = existingAccounts.some(
      (acc) =>
        acc.accountName.trim().toLowerCase() ===
        accountName.trim().toLowerCase(),
    );

    if (isDuplicate) {
      setErrorName("Account name already exists");
      valid = false;
    }

    if (!valid) return;

    const payload = {
      accountName,
      accountType,
      currentBalance: Number(currentBalance) || 0,
      cardColor,
    };

    try {
      await API.post("/account/createAccount", payload);
      onClose();
      onSaved(); // reload dashboard
    } catch (err) {
      console.error("Failed to save account", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AccountBalanceIcon />
        Add Account
      </DialogTitle>

      <DialogContent>
        <Box>
          <LeftAlignedLabel required>Account Name</LeftAlignedLabel>
          <TextField
            fullWidth
            value={accountName}
            onChange={(e) => {
              setAccountName(e.target.value);
              setErrorName("");
            }}
            error={Boolean(errorName)}
            helperText={errorName}
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          {/* Account Type */}
          <LeftAlignedLabel required>Account Type</LeftAlignedLabel>
          <TextField
            fullWidth
            select
            value={accountType}
            onChange={(e) => {
              setAccountType(e.target.value);
              setErrorType("");
            }}
            error={Boolean(errorType)}
            helperText={errorType}
          >
            <MenuItem value="Primary">Primary</MenuItem>
            <MenuItem value="Savings">Savings</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ mt: 1 }}>
          {/* Opening Balance */}
          <LeftAlignedLabel>Opening Balance</LeftAlignedLabel>
          <MoneyInput
            fullWidth
            value={currentBalance}
            onChange={(val) => setCurrentBalance(val)}
            sx={{ mt: 1, mb: 2 }}
          />
        </Box>

        <Box>
          {/* Card Color */}
          <LeftAlignedLabel>Card Color</LeftAlignedLabel>
          <Box display="flex" alignItems="center" gap={2} mt={1} mb={2}>
            <input
              type="color"
              value={cardColor}
              onChange={(e) => setCardColor(e.target.value)}
              style={{
                width: 50,
                height: 30,
                borderRadius: 6,
                cursor: "pointer",
                border: "1px solid #ccc",
              }}
            />
            <Typography>{cardColor}</Typography>
          </Box>
        </Box>
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
