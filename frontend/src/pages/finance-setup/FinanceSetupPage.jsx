import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import IncomeItems from "../../components/finance-setup/IncomeItems";
import ExpenseItems from "../../components/finance-setup/ExpenseItems";
import ExpenseCategory from "../../components/finance-setup/ExpenseCategory";

export default function FinanceSetupPage() {
  const [tab, setTab] = useState(0);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Finance Setup
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
        Configure income items, expense items, and categories that power your
        monthly budgets. Setting these up once makes budget creation faster and
        more accurate.
      </Typography>
      <Divider flexItem />
      <Box sx={{ mt: 1 }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab label="Expense Categories" />
          <Tab label="Income Items" />
          <Tab label="Expense Items" />
        </Tabs>

        <Box sx={{ p: 1 }}>
          {tab === 0 && (
            <ExpenseCategory
              onActionComplete={(msg) => {
                setAlert({
                  open: true,
                  message: msg,
                  severity: "success",
                });
              }}
            />
          )}
          {tab === 1 && (
            <IncomeItems
              onActionComplete={(msg) => {
                setAlert({
                  open: true,
                  message: msg,
                  severity: "success",
                });
              }}
            />
          )}
          {tab === 2 && (
            <ExpenseItems
              onActionComplete={(msg) => {
                setAlert({
                  open: true,
                  message: msg,
                  severity: "success",
                });
              }}
            />
          )}
        </Box>
      </Box>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
