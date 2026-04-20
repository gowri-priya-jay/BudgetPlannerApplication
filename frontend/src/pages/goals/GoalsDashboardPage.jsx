import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import { Card, CardContent, CardHeader, CardActionArea } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GoalIcon from "@mui/icons-material/FlagCircle";
import TargetIcon from "@mui/icons-material/TrackChangesRounded";
import SavingsIcon from "@mui/icons-material/SavingsRounded";
import API from "../../services/api";
import GoalDialog from "../../components/goals/GoalDialog";
import GoalViewDialog from "../../components/goals/GoalViewDialog";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";
import GoalTransferDialog from "../../components/goals/GoalTransferDialog";
import WithdrawDialog from "../../components/goals/WithdrawDialog";

export default function GoalsDashboardPage() {
  const [goals, setGoals] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [transferId, setTransferId] = useState(null);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [withdrawId, setWithdrawId] = useState(null);
  const [withdrawDialog, setWithdrawDialog] = useState(false);

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setAlertOpen(true);
  };

  // Fetch goals
  const loadGoals = useCallback(async () => {
    try {
      const res = await API.get("/goal/getAllGoals");
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to load goals", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await loadGoals();
    };
    load();
  }, [loadGoals]);

  const openMenu = (event, goal) => {
    setAnchorEl(event.currentTarget);
    setSelectedGoal(goal);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setSelectedGoal(null);
  };

  // Handle Add Goal
  const handleAddGoal = () => {
    setEditId(null);
    setOpenDialog(true);
  };

  // Handle Delete Goal
  const handleDeleteGoal = async () => {
    try {
      await API.delete(`/goal/deleteGoal/${deleteId}`);
      setDeleteConfirmDialog(false);
      loadGoals();
      showAlert("Goal deleted successfully");
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined) return "0.00";

    return new Intl.NumberFormat("en-AU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Goals
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Track your savings progress and stay motivated.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddGoal}
        >
          Add Goal
        </Button>
      </Box>
      <Divider sx={{ mb: 1 }} />
      {goals.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 5, color: "text.secondary" }}>
          <Typography variant="h6">No goals added yet.</Typography>
          <Typography variant="body2">
            Click “Add Goal” to get started.
          </Typography>
        </Box>
      )}
      <Box>
        <Grid container spacing={1}>
          {goals.map((goal) => {
            const progress = Math.round(
              (goal.savedAmount / goal.targetAmount) * 100,
            );
            return (
              <Grid key={goal.goalId}>
                <Card>
                  <CardHeader
                    title={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <GoalIcon />
                        <Typography>{goal.goalName}</Typography>
                      </Box>
                    }
                    action={
                      <IconButton onClick={(e) => openMenu(e, goal)}>
                        <MoreVertIcon />
                      </IconButton>
                    }
                  />

                  <CardActionArea
                    disableRipple
                    onClick={() => {
                      setViewId(goal.goalId);
                      setOpenViewDialog(true);
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid size={5}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <TargetIcon sx={{ mr: 1, fontSize: "12px" }} />
                            <Typography variant="subtitle2">Target</Typography>
                          </Box>
                        </Grid>
                        <Grid size={1}>
                          <Typography variant="subtitle2">:</Typography>
                        </Grid>
                        <Grid size={5}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            ${formatMoney(goal.targetAmount)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid size={5}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <SavingsIcon sx={{ mr: 1, fontSize: "12px" }} />
                            <Typography variant="subtitle2">Saved</Typography>
                          </Box>
                        </Grid>
                        <Grid size={1}>
                          <Typography variant="subtitle2">:</Typography>
                        </Grid>
                        <Grid size={5}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            ${formatMoney(goal.savedAmount)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider flexItem sx={{ mt: 0.5, mb: 0.5 }} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Goal Progress :
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 5,
                          borderRadius: 1,
                          mt: 0.5,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {progress}% Completed
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                {/* Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                >
                  <MenuItem
                    onClick={() => {
                      setEditId(selectedGoal.goalId);
                      setOpenDialog(true);
                      closeMenu();
                    }}
                  >
                    Edit Goal
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setViewId(selectedGoal.goalId);
                      setOpenViewDialog(true);
                      closeMenu();
                    }}
                  >
                    View Goal
                  </MenuItem>

                  {!selectedGoal?.isExternal && (
                    <MenuItem
                      onClick={() => {
                        setTransferId(selectedGoal.goalId);
                        setOpenTransferDialog(true);
                        closeMenu();
                      }}
                    >
                      Transfer Amount
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      setWithdrawId(selectedGoal.goalId);
                      setWithdrawDialog(true);
                      closeMenu();
                    }}
                  >
                    Withdraw Amount
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setDeleteId(selectedGoal.goalId);
                      setDeleteConfirmDialog(true);
                      closeMenu();
                    }}
                    sx={{ color: "red" }}
                  >
                    Delete Goal
                  </MenuItem>
                </Menu>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      {/* Add/Edit Goal Dialog */}
      <GoalDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editId={editId}
        onSaved={() => {
          loadGoals();
          showAlert(
            editId ? "Goal updated successfully" : "Goal added successfully",
          );
        }}
      />
      {/* View Goal Dialog */}
      <GoalViewDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        goalId={viewId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmDialog}
        title="Delete Goal"
        message="This goal and its progress data will be permanently deleted. Do you want to continue?"
        onClose={() => setDeleteConfirmDialog(false)}
        onConfirm={handleDeleteGoal}
      />

      {/* Goal Transfer Dialog */}
      <GoalTransferDialog
        open={openTransferDialog}
        onClose={() => setOpenTransferDialog(false)}
        goalId={transferId}
        onSaved={() => {
          loadGoals();
          showAlert("Amount transfer between goal was successful");
        }}
      />

      {/* Withdraw Dialog */}
      <WithdrawDialog
        open={withdrawDialog}
        onClose={() => setWithdrawDialog(false)}
        goalId={withdrawId}
        onSaved={() => {
          loadGoals();
          showAlert("Withdrawal was successful");
        }}
      />
      {/* Alert pop up */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
