import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Divider, Button, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import API from "../../services/api";

import AccountCard from "../../components/Dashboard/AccountCards";
import AddAccountDialog from "../../components/Dashboard/AddAccountDialog";
import ViewAccountDialog from "../../components/Dashboard/ViewAccountDialog ";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";
import QuickStatsRow from "../../components/Dashboard/QuickStatsRow";
import OverallGoalProgressList from "../../components/charts/OverallGoalProgressList";
import BudgetAlerts from "../../components/Dashboard/BudgetAlerts";

const DashboardPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [opneDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const loadDashboard = async () => {
    try {
      const accRes = await API.get("/account/getAllAccounts");
      setAccounts(accRes.data);
      const budgetRes = await API.get("/budget/getAllBudgets");
      setBudgets(budgetRes.data);
      const goalRes = await API.get("/goal/getAllGoals");
      setGoals(goalRes.data);
    } catch (err) {
      console.error("Dashboard load error", err);
    }
  };

  const handleAddAccount = () => {
    setOpenAddDialog(true);
  };

  const handleSaveAccount = async () => {
    setOpenAddDialog(false);
    loadDashboard();
    setAlertMessage("Account added Succesfully");
    setShowAlert(true);
  };

  const handleDeleteAccount = async () => {
    try {
      await API.delete(`/account/${selectedAccount.accountId}`);
      setOpenDeleteConfirmDialog(false);
      loadDashboard();
      setAlertMessage("Account deleted Succesfully");
      setShowAlert(true);
    } catch (err) {
      console.error("Failed to delete account", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      loadDashboard();
    };
    load();
  }, []);

  return (
    <Box>
      {/* Accounts Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={600}>
          Accounts
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddAccount}
        >
          Add Account
        </Button>
      </Box>

      <Divider sx={{ mb: 1, mt: 0.5 }} />
      {/* ERROR ALERT */}
      {showAlert && (
        <Alert
          severity="success"
          onClose={() => setShowAlert(false)}
          sx={{ mb: 1 }}
        >
          {alertMessage}
        </Alert>
      )}

      <Grid container spacing={1}>
        {accounts.map((acc) => (
          <Grid key={acc.accountId}>
            <AccountCard
              account={acc}
              onView={(acc) => {
                setSelectedAccount(acc);
                setOpenViewDialog(true);
              }}
              onDelete={(acc) => {
                setSelectedAccount(acc);
                setOpenDeleteConfirmDialog(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      <AddAccountDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSaved={handleSaveAccount}
      />

      <ViewAccountDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        account={selectedAccount}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={opneDeleteConfirmDialog}
        title="Delete Account"
        message="This will be permanently delete the account. Do you want to continue?"
        onClose={() => setOpenDeleteConfirmDialog(false)}
        onConfirm={handleDeleteAccount}
      />

      {/* Quick Stats of Accounts */}
      <Box mt={2}>
        <QuickStatsRow accounts={accounts} goals={goals} />
      </Box>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid size={6}>
          <Box
            sx={{
              backgroundColor: "#375462",
              color: "white",
              p: 0.5,
              alignItems: "center",
              display: "flex",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Financial Goals Snapshot
            </Typography>
          </Box>
          <OverallGoalProgressList goals={goals} />
        </Grid>
        <Grid size={6}>
          <Box
            sx={{
              backgroundColor: "#375462",
              color: "white",
              p: 0.5,
              alignItems: "center",
              display: "flex",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Budgets That Need Action
            </Typography>
          </Box>
          <BudgetAlerts budgets={budgets} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
