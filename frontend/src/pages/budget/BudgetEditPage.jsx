import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  MenuItem,
  TextField,
  Alert,
  Grid,
  Tabs,
  Tab
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

import IncomeTab from "./IncomeTab";
import ExpenseTab from "./ExpenseTab";
import SummaryCard from "../../components/Budget/SummaryCard";
import LeftAlignedLabel from "../../components/LeftAlignedLabel";

import IncomeIcon from "@mui/icons-material/ArrowCircleUpRounded";
import ExpenseIcon from "@mui/icons-material/ArrowCircleDownRounded";
import SavingsIcon from "@mui/icons-material/Savings";

import API from "../../services/api";

const EditBudgetPage = () => {
  const navigate = useNavigate();
  const { budgetId } = useParams();

  const [loading, setLoading] = useState(true);
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
  const [initialBudgetState, setInitialBudgetState] = useState(null);

useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);

      const [incRes, accRes, catRes, expRes, budgetRes] = await Promise.all([
        API.get("/master/getIncomeItems"),
        API.get("/account/getAllAccounts"),
        API.get("/master/getExpenseCategories"),
        API.get("/master/getExpenseItems"),
        API.get(`/budget/${budgetId}`),
      ]);

      setAccounts(accRes.data || []);

      // Income master
      const incomes = (incRes.data || []).map((i) => ({
        incomeId: i.incomeId,
        incomeName: i.incomeName,
      }));
      setIncomeItems(incomes);

      // Expense master
      const categories = catRes.data || [];
      const items = expRes.data || [];
      setExpenseCategories(categories);

      const grouped = {};
      categories.forEach((cat) => {
        grouped[cat.categoryId] = items.filter(
          (i) => i.categoryId === cat.categoryId
        );
      });
      setExpenseItemsByCategory(grouped);

      // ---------------- PREFILL BUDGET ----------------
      const b = budgetRes.data;

      // Date
      const monthMap = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
      };

      const date = dayjs(`${b.year}-${monthMap[b.month] + 1}-01`);
      setSelectedDate(date);

      // Account
      setAccountId(b.account.accountId);

      // Income array → object
      const incomeObj = {};
      (b.incomes || []).forEach((i) => {
        incomeObj[i.incomeId] = i;
      });
      setMonthlyIncomes(incomeObj);

      // Expense array → object
      const expenseObj = {};
      (b.expenses || []).forEach((e) => {
        expenseObj[e.expenseId] = e;
      });
      setMonthlyExpenses(expenseObj);
      setInitialBudgetState({
        monthlyIncomes: incomeObj,
        monthlyExpenses: expenseObj,
        accountId: b.account.accountId,
        selectedDate: date.format("YYYY-MM"),
      });
    } catch (err) {
      console.error("Error loading edit budget", err);
    } finally {
      setLoading(false);
    }
  };
  load();
}, [budgetId]);

  // ---------------- TOTALS ----------------
  const totalPlannedIncome = Number(
    Object.values(monthlyIncomes).reduce(
      (sum, r) => sum + Number(r.plannedIncome || 0),
      0
    )
  ).toFixed(2);

  const totalActualIncome = Number(
    Object.values(monthlyIncomes).reduce(
      (sum, r) => sum + Number(r.actualIncome || 0),
      0
    )
  ).toFixed(2);

  const totalPlannedExpense = Number(
    Object.values(monthlyExpenses).reduce(
      (sum, r) => sum + Number(r.plannedExpense || 0),
      0
    )
  ).toFixed(2);

  const totalActualExpense = Number(
    Object.values(monthlyExpenses).reduce(
      (sum, r) => sum + Number(r.actualExpense || 0),
      0
    )
  ).toFixed(2);

  const netPlanned = Number(totalPlannedIncome - totalPlannedExpense).toFixed(2);
  const netActual = Number(totalActualIncome - totalActualExpense).toFixed(2);

  const currentBudgetState = {
  monthlyIncomes,
  monthlyExpenses,
  accountId,
  selectedDate: selectedDate?.format("YYYY-MM"),
};
  const isDirty =
  initialBudgetState &&
  JSON.stringify(initialBudgetState) !== JSON.stringify(currentBudgetState);

  // ---------------- SAVE ----------------
  const onSubmit = async () => {
    setSaveError("");

    try {
      setSaving(true);

      const month = selectedDate.month() + 1;
      const monthName = selectedDate.format("MMMM");
      const year = selectedDate.year();

      const payload = {
        budgetId,
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

      await API.put("/budget/updateBudget", payload);

      navigate("/budgets", {
        state: { successMessage: "Budget updated successfully" },
      });
    } catch (err) {
      console.error(err);
      setSaveError("Something went wrong while updating.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Edit Budget
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Update your income and expenses for this budget period.
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

      {/* ERROR */}
      {saveError && (
        <Alert severity="error" onClose={() => setSaveError("")} sx={{ mb: 1 }}>
          {saveError}
        </Alert>
      )}

      {/* TOP FORM */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <LeftAlignedLabel required sx={{ fontWeight: "500" }}>
          Budget Month
        </LeftAlignedLabel>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["month", "year"]}
            value={selectedDate}
            readOnly
            slotProps={{
              textField: {
                size: "small",
                InputProps: { readOnly: true },
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
              readOnly: true,
             },
          }}
          sx={{ marginTop: 0, minWidth: "150px" }}
        >
          <MenuItem value="">--Select Account--</MenuItem>
          {accounts.map((a) => (
            <MenuItem key={a.accountId} value={a.accountId}>
              {a.accountName}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* MAIN GRID */}
      <Box sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          {/* SUMMARY */}
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

          {/* TABS */}
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
      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Button variant="contained" onClick={onSubmit} disabled={!isDirty}>
          {saving ? "Updating..." : "Update Budget"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditBudgetPage;