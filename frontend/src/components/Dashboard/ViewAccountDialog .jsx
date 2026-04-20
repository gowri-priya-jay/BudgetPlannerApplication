import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import LeftAlignedLabel from "../LeftAlignedLabel";

const ViewAccountDialog = ({ open, onClose, account }) => {
  if (!account) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={600}>Account Details</DialogTitle>
      <DialogContent dividers>
        <Box>
          <LeftAlignedLabel>Account Name</LeftAlignedLabel>
          <TextField
            value={account.accountName}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          <LeftAlignedLabel>Account Type</LeftAlignedLabel>
          <Box>
            <Chip
              label={account.accountType}
              size="small"
              sx={{ mt: 1, fontWeight: 600 }}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 1 }}>
          <LeftAlignedLabel>Current Balance</LeftAlignedLabel>
          <TextField
            value={account.currentBalance.toFixed(2)}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography>$</Typography>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          <LeftAlignedLabel>Card Color</LeftAlignedLabel>
          <Box
            sx={{
              width: 40,
              height: 20,
              borderRadius: 1,
              background: account.cardColor,
              mt: 1,
            }}
          />
        </Box>

        <Box sx={{ mt: 1 }}>
          <LeftAlignedLabel>Account ID</LeftAlignedLabel>
          <TextField
            value={account.accountId}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAccountDialog;
