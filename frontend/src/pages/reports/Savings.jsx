import { useMemo, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Paper,
  Pagination,
  Grid,
} from "@mui/material";

const MONTH_ORDER = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export default function Savings({ rows }) {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const rowsPerPage = 12;

  const statusColors = {
    Allocated: "#00a506",
    "Needs Reallocation": "#ffab2e",
    "Not Allocated": "#e9666e",
  };

  const getStatusColor = (status) => statusColors[status] || "#607D8B";

  const toggleSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDir("asc");
    } else {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    }
  };

  const filtered = useMemo(() => {
    return rows.filter((r) =>
      filterStatus === "ALL" ? true : r.allocationStatus === filterStatus,
    );
  }, [rows, filterStatus]);

  const sorted = useMemo(() => {
    const data = [...filtered];

    if (!sortField) return data;

    return data.sort((a, b) => {
      if (sortField === "month") {
        const diff = MONTH_ORDER[a.month] - MONTH_ORDER[b.month];
        return sortDir === "asc" ? diff : -diff;
      }

      const diff = (a[sortField] || 0) - (b[sortField] || 0);
      return sortDir === "asc" ? diff : -diff;
    });
  }, [filtered, sortField, sortDir]);

  const paginated = useMemo(() => {
    return sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [sorted, page]);

  const totalActual = rows.reduce((sum, r) => sum + (r.totalSavings || 0), 0);
  const totalPlanned = rows.reduce(
    (sum, r) => sum + (r.plannedSavings || 0),
    0,
  );

  const allocationStatuses = useMemo(
    () => Array.from(new Set(rows.map((r) => r.allocationStatus))),
    [rows],
  );

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography fontWeight={600}>Allocation Status :</Typography>
            <Select
              size="small"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              sx={{ minWidth: 180, maxWidth: 180, ml: 2, marginTop: 0 }}
            >
              <MenuItem value="ALL">ALL</MenuItem>
              {allocationStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
        <Grid size={8}>
          <Box
            sx={{
              p: 0.5,
              bgcolor: "#f5f7fa",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              Filters Applied :
            </Typography>
            <Typography variant="subtitle2" sx={{ ml: 2 }}>
              Allocation Status = {filterStatus}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          my: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Chip
            label={
              <Box display="flex">
                <Typography variant="caption">
                  Total Planned Savings : &nbsp;
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  ${totalPlanned.toFixed(2)}
                </Typography>
              </Box>
            }
          />

          <Chip
            label={
              <Box display="flex">
                <Typography variant="caption">
                  Total Actual Savings : &nbsp;
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  ${totalActual.toFixed(2)}
                </Typography>
              </Box>
            }
            sx={{
              ml: 2,
            }}
          />
        </Box>
        <Pagination
          count={Math.ceil(sorted.length / rowsPerPage)}
          page={page}
          size="small"
          onChange={(e, value) => setPage(value)}
        />
      </Box>

      <Paper elevation={1} sx={{ p: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => toggleSort("month")}
                sx={{ cursor: "pointer", fontWeight: 600 }}
              >
                Month{" "}
                {sortField !== "month" ? "⬍" : sortDir === "asc" ? "▲" : "▼"}
              </TableCell>

              <TableCell
                onClick={() => toggleSort("plannedSavings")}
                sx={{ cursor: "pointer", fontWeight: 600 }}
              >
                Planned{" "}
                {sortField !== "plannedSavings"
                  ? "⬍"
                  : sortDir === "asc"
                    ? "▲"
                    : "▼"}
              </TableCell>

              <TableCell
                onClick={() => toggleSort("totalSavings")}
                sx={{ cursor: "pointer", fontWeight: 600 }}
              >
                Actual{" "}
                {sortField !== "totalSavings"
                  ? "⬍"
                  : sortDir === "asc"
                    ? "▲"
                    : "▼"}
              </TableCell>

              <TableCell sx={{ fontWeight: 600 }}>Allocated Amount</TableCell>

              <TableCell sx={{ fontWeight: 600 }}>Allocation Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell>{r.month}</TableCell>
                <TableCell>{r.plannedSavings ?? 0}</TableCell>
                <TableCell>{r.totalSavings ?? 0}</TableCell>
                <TableCell>{r.allocatedAmount ?? 0}</TableCell>

                <TableCell>
                  <Chip
                    label={r.allocationStatus}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(r.allocationStatus),
                      color: "white",
                      fontWeight: 600,
                      fontSize: "10px",
                      height: "20px",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
