import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';

export default function DeleteConfirmDialog({
  open,
  title,
  message,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: 600,
        }}
      >
        <ReportProblemRoundedIcon sx={{ color: "#c96b00"}} />
        {title}
        </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <Divider flexItem />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
