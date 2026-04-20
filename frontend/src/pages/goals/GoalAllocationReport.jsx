import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Checkbox,
  CircularProgress,
  ListItemText,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Pagination,
} from "@mui/material";
import API from "../../services/api";
import LeftAlignedLabel from "../../components/LeftAlignedLabel";

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

export default function GoalAllocationReport() {
  const [loadingInit, setLoadingInit] = useState(true);
  const [hasGoals, setHasGoals] = useState(false);
  const [yearList, setYearList] = useState([]);

  const [year, setYear] = useState("");
  const [months, setMonths] = useState(["ALL"]);

  const [rows, setRows] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);

  const [loadingReport, setLoadingReport] = useState(false);
  const [goalFilter, setGoalFilter] = useState("ALL");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const rowsPerPage = 12;

  useEffect(() => {
    const init = async () => {
      try {
        const goalRes = await API.get("/goal/getAllGoals");
        const hasGoalData = goalRes.data?.length > 0;
        setHasGoals(hasGoalData);
        if (!hasGoalData) {
          setLoadingInit(false);
          return;
        }
        const yearsRes = await API.get("/budget/getBudgetedYear");
        setYearList(yearsRes.data || []);
      } catch (err) {
        console.error("Error during init:", err);
      } finally {
        setLoadingInit(false);
      }
    };
    init();
  }, []);

  const loadReport = async () => {
    if (!year || !months || months.length === 0) return;
    setLoadingReport(true);
    try {
      const payload = {
        year,
        months,
      };
      const res = await API.post("/goal/allocation-report", payload);
      setRows(res.data.allocationDetails || []);
      setTotalSaved(res.data.totalAllocatedAmount || 0);
      setPage(1);
      setGoalFilter("ALL");
      setSortField(null);
      setSortDir("asc");
    } catch (err) {
      console.error("Error loading report:", err);
    } finally {
      setLoadingReport(false);
    }
  };

  const goalNames = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => set.add(r.goalName));
    return ["ALL", ...Array.from(set)];
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) =>
      goalFilter === "ALL" ? true : r.goalName === goalFilter,
    );
  }, [rows, goalFilter]);

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

  const totalFiltered = filtered.reduce(
    (sum, r) => sum + (r.allocatedAmount || 0),
    0,
  );

  const toggleSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDir("asc");
    } else {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    }
  };

  if (loadingInit) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!hasGoals) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          No goals available. Please create a goal first.
        </Typography>
      </Box>
    );
  }

  if (hasGoals && yearList.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          No budgets found. Please create a budget first.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#375462",
          p: 1,
          color: "white",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} lineHeight={1}>
          Goal Allocation Report
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" ml={1}>
          <LeftAlignedLabel>Year</LeftAlignedLabel>
          <Select
            size="small"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            displayEmpty
            sx={{ minWidth: 120, maxWidth: 120, ml: 1, marginTop: 0 }}
          >
            <MenuItem value="">Select Year</MenuItem>
            {yearList.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
          <LeftAlignedLabel sx={{ ml: 1 }}>Months</LeftAlignedLabel>
          <Select
            multiple
            value={months}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={{
              PaperProps: {
                style: { maxHeight: 300 },
              },
            }}
            sx={{ minWidth: "200px", maxWidth: "200px", marginTop: 0, ml: 1 }}
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
            disabled={!year}
            onClick={loadReport}
            sx={{ ml: 1 }}
          >
            {loadingReport ? "Loading..." : "Load"}
          </Button>
        </Box>
      </Box>
      <Paper elevation={1} sx={{ p: 1, mt: 1 }}>
        {rows.length === 0 ? (
          <Typography variant="body1">
            No report data loaded. Choose filters and click Load.
          </Typography>
        ) : (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography fontWeight={600}>Goal :</Typography>
              <Select
                size="small"
                value={goalFilter}
                onChange={(e) => {
                  setGoalFilter(e.target.value);
                  setPage(1);
                }}
                sx={{ minWidth: 150, maxWidth: 150, ml: 1, marginTop: 0 }}
              >
                {goalNames.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
              <Box
                sx={{
                  p: 0.5,
                  bgcolor: "#f5f7fa",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  height: "30px",
                  ml: 1,
                  width: 250,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Filters Applied :
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Goal = {goalFilter}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Chip
                label={
                  <Box display={"flex"} alignItems={"center"}>
                    <Typography variant="body2">
                      Allocated Amount : &nbsp;
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      ${totalSaved.toFixed(2)}
                    </Typography>
                  </Box>
                }
                sx={{}}
              />
              <Pagination
                count={Math.ceil(sorted.length / rowsPerPage) || 1}
                page={page}
                size="small"
                onChange={(e, value) => setPage(value)}
              />
            </Box>

            {/* TABLE */}
            <Box
              sx={{
                maxHeight: "500px",
                overflowY: "auto",
                width: "100%",
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => toggleSort("month")}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        backgroundColor: "#cde1ea",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                      }}
                    >
                      Month{" "}
                      {sortField === "month"
                        ? sortDir === "asc"
                          ? "▲"
                          : "▼"
                        : "⬍"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#cde1ea",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                      }}
                    >
                      Goal
                    </TableCell>
                    <TableCell
                      onClick={() => toggleSort("allocatedAmount")}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        backgroundColor: "#cde1ea",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                      }}
                    >
                      Allocated Amount{" "}
                      {sortField === "allocatedAmount"
                        ? sortDir === "asc"
                          ? "▲"
                          : "▼"
                        : "⬍"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{r.monthName}</TableCell>
                      <TableCell>{r.goalName}</TableCell>
                      <TableCell>{r.allocatedAmount}</TableCell>
                    </TableRow>
                  ))}

                  {filtered.length > 0 && (
                    <TableRow sx={{ backgroundColor: "#cde1ea" }}>
                      <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                        Total
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {totalFiltered.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
