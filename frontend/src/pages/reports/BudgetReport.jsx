import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import { Checkbox, ListItemText } from "@mui/material";
import API from "../../services/api";
import IncomeTable from "./Income";
import ExpenseTable from "./Expense";
import LeftAlignedLabel from "../../components/LeftAlignedLabel";
import Savings from "./Savings";

const ALL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BudgetReport() {
  const [loadingInit, setLoadingInit] = useState(true);
  const [hasBudgets, setHasBudgets] = useState(false);
  const [years, setYears] = useState([]);

  const [year, setYear] = useState("");
  const [months, setMonths] = useState(["ALL"]);

  const [loadingReport, setLoadingReport] = useState(false);
  const [incomeRows, setIncomeRows] = useState([]);
  const [expenseRows, setExpenseRows] = useState([]);
  const [savingsRows, setSavingsRows] = useState([]);

  const [tab, setTab] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const budgetsRes = await API.get("/budget/hasCompletedBudget");
        const yearsRes = await API.get("/budget/getBudgetedYear");
        setHasBudgets(budgetsRes.data);
        setYears(yearsRes.data || []);
        if (yearsRes.data && yearsRes.data.length > 0) {
          setYear(yearsRes.data[0]);
        }
      } catch (err) {
        console.error("Error during init:", err);
        setHasBudgets(false);
      } finally {
        setLoadingInit(false);
      }
    };
    init();
  }, []);

  const handleLoadReport = async () => {
    if (!year || !months || months.length === 0) return;
    setLoadingReport(true);
    try {
      const payload = {
        year,
        months,
      };
      const res = await API.post("/reports/getBudgetReport", payload);
      setIncomeRows(res.data.incomeRows || []);
      setExpenseRows(res.data.expenseRows || []);
      setSavingsRows(res.data.savingsRows || []);
    } catch (err) {
      console.error("Error loading report:", err);
      setIncomeRows([]);
      setExpenseRows([]);
      setSavingsRows([]);
    } finally {
      setLoadingReport(false);
    }
  };

  if (loadingInit) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!hasBudgets) {
    return (
      <Box>
        <Typography>Budget Report</Typography>
        <Divider flexItem sx={{ my: 1 }}/>
        <Typography variant="h6" fontWeight={600} textAlign={"center"}>No budgets available</Typography>
        <Typography variant="body2" mt={1} textAlign={"center"}>Create budget first to view report</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Budget Report
        </Typography>
        <Box>
          <LeftAlignedLabel required sx={{ mx: 1 }}>
            Year
          </LeftAlignedLabel>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{
              minWidth: "200px",
              marginTop: 0,
            }}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
          <LeftAlignedLabel required sx={{ mx: 1 }}>
            Months
          </LeftAlignedLabel>
          <Select
            multiple
            value={months}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={{
              PaperProps: {
                style: { maxHeight: 300 },
              },
            }}
            sx={{ minWidth: "250px", maxWidth: "250px", marginTop: 0 }}
          >
            <MenuItem
              value="ALL"
              onClick={() => {
                setMonths(["ALL"]);
              }}
            >
              <Checkbox checked={months.length === 1 && months[0] === "ALL"} />
              <ListItemText primary="ALL" />
            </MenuItem>

            {ALL_MONTHS.map((m) => (
              <MenuItem
                key={m}
                value={m}
                onClick={() => {
                  let newMonths = [...months];
                  if (newMonths.includes("ALL")) {
                    newMonths = [];
                  }
                  if (newMonths.includes(m)) {
                    newMonths = newMonths.filter((x) => x !== m);
                  } else {
                    newMonths.push(m);
                  }
                  if (newMonths.length === 0) {
                    newMonths = ["ALL"];
                  }

                  setMonths(newMonths);
                }}
              >
                <Checkbox checked={months.includes(m)} />
                <ListItemText primary={m} />
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            onClick={handleLoadReport}
            disabled={loadingReport}
            sx={{ mx: 1 }}
          >
            {loadingReport ? "Loading..." : "Load Report"}
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 1 }}>
        {incomeRows.length === 0 &&
        expenseRows.length === 0 &&
        savingsRows.length === 0 ? (
          <Typography variant="body1">
            No report data loaded. Choose filters and click Load.
          </Typography>
        ) : (
          <Box>
            <Tabs
              variant="fullWidth"
              value={tab}
              onChange={(e, v) => setTab(v)}
              sx={{ mb: 1 }}
            >
              <Tab label="Income" />
              <Tab label="Expense" />
              <Tab label="Savings" />
            </Tabs>
            {tab === 0 && <IncomeTable rows={incomeRows} />}
            {tab === 1 && <ExpenseTable rows={expenseRows} />}

            {tab === 2 && <Savings rows={savingsRows} />}
          </Box>
        )}
      </Box>
    </Box>
  );
}
