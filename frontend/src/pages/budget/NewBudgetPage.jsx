import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Button,
  Alert,
  Grid,
  MenuItem,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import IncomeTab from "./IncomeTab";
import ExpenseTab from "./ExpenseTab";
import SummaryCard from "../../components/Budget/SummaryCard";
import LeftAlignedLabel from "../../components/LeftAlignedLabel";

import API from "../../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IncomeIcon from "@mui/icons-material/ArrowCircleUpRounded";
import ExpenseIcon from "@mui/icons-material/ArrowCircleDownRounded";
import SavingsIcon from "@mui/icons-material/SavingsRounded";

const NewBudgetPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [mainTab, setMainTab] = useState("income");

  const [incomeItems, setIncomeItems] = useState([]);
  const [monthlyIncomes, setMonthlyIncomes] = useState({});

  const [expenseCategories, setExpenseCategories] = useState([]);
  const [expenseItemsByCategory, setExpenseItemsByCategory] = useState({});
  const [monthlyExpenses, setMonthlyExpenses] = useState({});

  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  // LOAD MASTER DATA
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const incRes = await API.get("/master/getIncomeItems");
        const accRes = await API.get("/account/getAllAccounts");

        setAccounts(accRes.data || []);

        const incomes = (incRes.data || []).map((i) => ({
          incomeId: i.incomeId,
          incomeName: i.incomeName,
        }));

        setIncomeItems(incomes);

        const incState = {};
        incomes.forEach((i) => {
          incState[i.incomeId] = {
            incomeId: i.incomeId,
            plannedIncome: 0,
            actualIncome: 0,
          };
        });
        setMonthlyIncomes(incState);

        const [catRes, expRes] = await Promise.all([
          API.get("/master/getExpenseCategories"),
          API.get("/master/getExpenseItems"),
        ]);

        const categories = catRes.data || [];
        const items = expRes.data || [];

        setExpenseCategories(categories);

        const grouped = {};
        categories.forEach((cat) => {
          grouped[cat.categoryId] = items.filter(
            (i) => i.categoryId === cat.categoryId,
          );
        });
        setExpenseItemsByCategory(grouped);

        const expState = {};
        items.forEach((i) => {
          expState[i.expenseId] = {
            expenseId: i.expenseId,
            plannedExpense: 0,
            actualExpense: 0,
            categoryId: i.categoryId,
          };
        });
        setMonthlyExpenses(expState);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Calculate totals

  const totalPlannedIncome = Number(
    Object.values(monthlyIncomes).reduce(
      (sum, r) => sum + Number(r.plannedIncome || 0),
      0,
    ),
  ).toFixed(2);

  const totalActualIncome = Number(
    Object.values(monthlyIncomes).reduce(
      (sum, r) => sum + Number(r.actualIncome || 0),
      0,
    ),
  ).toFixed(2);

  const totalPlannedExpense = Number(
    Object.values(monthlyExpenses).reduce(
      (sum, r) => sum + Number(r.plannedExpense || 0),
      0,
    ),
  ).toFixed(2);

  const totalActualExpense = Number(
    Object.values(monthlyExpenses).reduce(
      (sum, r) => sum + Number(r.actualExpense || 0),
      0,
    ),
  ).toFixed(2);

  const netPlanned = Number(totalPlannedIncome - totalPlannedExpense).toFixed(
    2,
  );
  const netActual = Number(totalActualIncome - totalActualExpense).toFixed(2);

  // VALIDATION: At least one row must have planned or actual > 0
  const hasAtLeastOneValue =
    Object.values(monthlyIncomes).some(
      (r) => Number(r.plannedIncome) > 0 || Number(r.actualIncome) > 0,
    ) ||
    Object.values(monthlyExpenses).some(
      (r) => Number(r.plannedExpense) > 0 || Number(r.actualExpense) > 0,
    );

  // SAVE HANDLER
  const onSubmit = async () => {
    setSaveError("");
    if (!selectedDate) {
      setSaveError("Please provide value for Budget Month");
      return;
    }
    if (!accountId) {
      setSaveError("Please select an account.");
      return;
    }

    if (!hasAtLeastOneValue) {
      setSaveError(
        "Please enter at least one planned or actual value in income or expense.",
      );
      return;
    }

    try {
      setSaving(true);

      const month = selectedDate.month() + 1;
      const monthName = selectedDate.format("MMMM");
      const year = selectedDate.year();

      const payload = {
        monthName,
        month,
        year,
        accountId,
        monthlyIncomes: Object.values(monthlyIncomes),
        monthlyExpenses: Object.values(monthlyExpenses),
        totalPlannedIncome,
        totalActualIncome,
        totalPlannedExpense,
        totalActualExpense,
        netPlanned,
        netActual,
      };

      const response = await API.post("/budget/createBudget", payload);
      console.log("Backend response:", response.data);
      navigate("/budgets", {
        state: { successMessage: "Budget created successfully" },
      });
    } catch (err) {
      console.error(err);
      setSaveError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

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
          <Typography variant="h6" fontWeight={600}>
            New Budget
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Create a new budget by planning your income and expenses for this
            period. Review the summary and adjust values as needed.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          sx={{
            minWidth: 0,
            width: 25,
            height: 25,
            borderRadius: "50%",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#375462",
            color: "white",
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 15 }} />
        </Button>
      </Box>

      <Divider flexItem sx={{ mb: 1 }} />

      {/* ERROR ALERT */}
      {saveError && (
        <Alert severity="error" onClose={() => setSaveError("")} sx={{ mb: 1 }}>
          {saveError}
        </Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <LeftAlignedLabel required sx={{ fontWeight: "500" }}>
          Budget Month
        </LeftAlignedLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["month", "year"]}
            value={selectedDate}
            onChange={(value) => setSelectedDate(value)}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />
        </LocalizationProvider>
        <LeftAlignedLabel required sx={{ fontWeight: "500" }}>
          Account
        </LeftAlignedLabel>
        <TextField
          select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          slotProps={{
            select: {
              displayEmpty: true,
            },
          }}
          sx={{ marginTop: 0, minWidth: "150px" }}
        >
          <MenuItem value="">--Select Account --</MenuItem>
          {accounts.map((a) => (
            <MenuItem key={a.accountId} value={a.accountId}>
              {a.accountName}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid size={3}>
            <Box
              sx={{
                backgroundColor: "#375462",
                padding: "4px 8px",
                minHeight: "30px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography color="white" fontSize="12px" fontWeight={600}>
                Summary
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateRows: "repeat(3,1fr)",
                gap: 4,
                mt: 2,
              }}
            >
              <SummaryCard
                title="Income"
                Icon={IncomeIcon}
                values={{
                  planned: totalPlannedIncome,
                  actual: totalActualIncome,
                }}
              />
              <SummaryCard
                title="Expense"
                Icon={ExpenseIcon}
                values={{
                  planned: totalPlannedExpense,
                  actual: totalActualExpense,
                }}
              />
              <SummaryCard
                title="Net Savings"
                Icon={SavingsIcon}
                values={{
                  planned: netPlanned,
                  actual: netActual,
                }}
              />
            </Box>
          </Grid>
          <Grid size={9}>
            <Tabs
              variant="fullWidth"
              value={mainTab}
              onChange={(e, v) => setMainTab(v)}
            >
              <Tab value="income" label="Income" />
              <Tab value="expense" label="Expense" />
            </Tabs>
            {mainTab === "income" && (
              <IncomeTab
                incomeItems={incomeItems}
                monthlyIncomes={monthlyIncomes}
                setMonthlyIncomes={setMonthlyIncomes}
                totalPlannedIncome={totalPlannedIncome}
                totalActualIncome={totalActualIncome}
              />
            )}

            {mainTab === "expense" && (
              <ExpenseTab
                expenseCategories={expenseCategories}
                expenseItemsByCategory={expenseItemsByCategory}
                monthlyExpenses={monthlyExpenses}
                setMonthlyExpenses={setMonthlyExpenses}
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* SAVE BUTTON */}
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={saving}
        sx={{ mt: 1 }}
      >
        {saving ? "Saving..." : "Save Budget"}
      </Button>
    </Box>
  );
};

export default NewBudgetPage;
