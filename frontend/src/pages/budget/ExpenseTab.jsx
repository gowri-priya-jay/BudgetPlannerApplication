import React, { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
} from "@mui/material";
import MoneyInput from "../../components/common/MoneyInput";

const ExpenseTab = ({
  expenseCategories,
  expenseItemsByCategory,
  monthlyExpenses,
  setMonthlyExpenses,
  readOnly = false,
}) => {
  // ---------------- SELECTED CATEGORY TAB ----------------
  const [selectedCategory, setSelectedCategory] = useState(
    expenseCategories?.[0]?.categoryId || 1,
  );

  // ---------------- FORMAT MONEY ----------------
  const formatMoney = (value) => {
    if (value === "" || value === null || value === undefined) return "";
    return Number(value).toFixed(2);
  };

  // ---------------- HANDLE VALUE CHANGE ----------------
  const handleChange = (expenseId, field, value) => {
    setMonthlyExpenses((prev) => ({
      ...prev,
      [expenseId]: {
        ...prev[expenseId],
        [field]: value,
      },
    }));
  };

  const categoryItems = expenseItemsByCategory[selectedCategory] || [];

  const categoryPlannedTotal = categoryItems.reduce((sum, item) => {
    const row = monthlyExpenses[item.expenseId] || {};
    return sum + Number(row.plannedExpense || 0);
  }, 0);

  const categoryActualTotal = categoryItems.reduce((sum, item) => {
    const row = monthlyExpenses[item.expenseId] || {};
    return sum + Number(row.actualExpense || 0);
  }, 0);

  return (
    <Box sx={{ p: 1 }}>
      <Typography color="text.primary" sx={{ fontWeight: 600 }}>
        Expense Items
      </Typography>
      {!readOnly && (
        <Typography variant="caption" color="text.secondary">
          Enter the planned and actual amounts for each expense item.
        </Typography>
      )}
      <Divider flexItem />
      <Tabs
        value={selectedCategory}
        onChange={(e, val) => setSelectedCategory(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 1, mt: 1 }}
      >
        {expenseCategories.map((cat) => (
          <Tab
            key={cat.categoryId}
            value={cat.categoryId}
            label={cat.categoryName}
            sx={{
              fontSize: "12px",
            }}
          />
        ))}
      </Tabs>

      <Paper sx={{ mt: 1, p: 1 }}>
        {/* ---------------- TABLE FOR SELECTED CATEGORY ---------------- */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#cde1ea" }}>
                <TableCell sx={{ width: "40%" }}>Expense Name</TableCell>
                <TableCell sx={{ width: "30%" }}>Planned</TableCell>
                <TableCell sx={{ width: "30%" }}>Actual</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(expenseItemsByCategory[selectedCategory] || []).map((item) => {
                const row = monthlyExpenses[item.expenseId] || {};

                return (
                  <TableRow key={item.expenseId}>
                    <TableCell>{item.expenseName}</TableCell>
                    <TableCell>
                      <MoneyInput
                        variant="table"
                        value={row.plannedExpense}
                        onChange={(val) =>
                          handleChange(item.expenseId, "plannedExpense", val)
                        }
                        onBlur={() =>
                          handleChange(
                            item.expenseId,
                            "plannedExpense",
                            formatMoney(row.plannedExpense),
                          )
                        }
                        readOnly={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <MoneyInput
                        variant="table"
                        value={row.actualExpense}
                        onChange={(val) =>
                          handleChange(item.expenseId, "actualExpense", val)
                        }
                        onBlur={() =>
                          handleChange(
                            item.expenseId,
                            "actualExpense",
                            formatMoney(row.actualExpense),
                          )
                        }
                        readOnly={readOnly}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow sx={{ backgroundColor: "#cde1ea" }}>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {categoryPlannedTotal.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {categoryActualTotal.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ExpenseTab;
