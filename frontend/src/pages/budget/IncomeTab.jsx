import React from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MoneyInput from "../../components/common/MoneyInput";

const IncomeTab = ({
  incomeItems,
  monthlyIncomes,
  setMonthlyIncomes,
  totalPlannedIncome,
  totalActualIncome,
  readOnly = false,
}) => {
  const handleChange = (incomeId, field, value) => {
    setMonthlyIncomes((prev) => ({
      ...prev,
      [incomeId]: {
        ...prev[incomeId],
        [field]: value,
      },
    }));
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography color="text.primary" sx={{ fontWeight: 600 }}>
        Income Items
      </Typography>
      {!readOnly && (
        <Typography variant="caption" color="text.secondary">
          Enter the planned and actual income amounts for each item.
        </Typography>
      )}
      <Divider flexItem />

      <Paper sx={{ mt: 1, p: 1 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#cde1ea" }}>
                <TableCell sx={{ width: "40%" }}>Income Name</TableCell>
                <TableCell sx={{ width: "30%" }}>Planned</TableCell>
                <TableCell sx={{ width: "30%" }}>Actual</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {incomeItems.map((item) => {
                const row = monthlyIncomes[item.incomeId] || {};

                return (
                  <TableRow key={item.incomeId}>
                    <TableCell>{item.incomeName}</TableCell>
                    <TableCell>
                      <MoneyInput
                        variant="table"
                        value={row.plannedIncome}
                        onChange={(val) =>
                          handleChange(item.incomeId, "plannedIncome", val)
                        }
                        readOnly={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <MoneyInput
                        variant="table"
                        value={row.actualIncome}
                        onChange={(val) =>
                          handleChange(item.incomeId, "actualIncome", val)
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
                  {totalPlannedIncome}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {totalActualIncome}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default IncomeTab;
