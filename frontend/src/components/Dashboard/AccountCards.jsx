import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { lighten, darken } from "@mui/material/styles";

const AccountCard = ({ account, onView, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const base = account.cardColor;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const getReadableTextColor = (hex) => {
    // Remove # if present
    hex = hex.replace("#", "");

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // If luminance is high → use black text
    return luminance > 0.6 ? "#000" : "#fff";
  };

  return (
    <Card
      sx={{
        width: 200,
        minWidth: 200,
        borderRadius: 2,
        background: `linear-gradient(135deg,
          ${darken(base, 0.05)} 0%,
          ${lighten(base, 0.65)} 100%
        )`,
        color: getReadableTextColor(base),
        position: "relative",
      }}
    >
      <IconButton
        size="small"
        sx={{
          position: "absolute",
          top: 5,
          right: 5,
          color: getReadableTextColor(base),
        }}
        onClick={handleMenuOpen}
      >
        <MoreVertIcon />
      </IconButton>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onView?.(account);
          }}
        >
          View Account
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDelete?.(account);
          }}
          sx={{ color: "red" }}
        >
          Delete Account
        </MenuItem>
      </Menu>

      {/* Card Content */}
      <CardContent>
        <Typography fontWeight={600} fontSize={16}>
          {account.accountName}
        </Typography>

        <Typography fontSize={22} fontWeight={700} mt={1}>
          ${account.currentBalance.toFixed(2)}
        </Typography>

        <Chip
          label={account.accountType}
          size="small"
          sx={{
            mt: 1,
            background: "rgba(255,255,255,0.25)",
            color: getReadableTextColor(base),
            fontWeight: 600,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AccountCard;
