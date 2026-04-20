import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
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
  Chip,
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

export default function GoalActivity() {
  const [loadingInit, setLoadingInit] = useState(true);
  const [goalList, setGoalList] = useState([]);
  const [yearList, setYearList] = useState([]);

  const [goalName, setGoalName] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [year, setYear] = useState("");
  const [months, setMonths] = useState(["ALL"]);

  const [allRows, setAllRows] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);

  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;

  useEffect(() => {
    const init = async () => {
      try {
        const goalsRes = await API.get("/goal/getAllGoals");
        setGoalList(goalsRes.data || []);
        const yearsRes = await API.get("/budget/getBudgetedYear");
        setYearList(yearsRes.data || []);
      } catch (err) {
        console.error("Init error:", err);
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

      const res = await API.post(`/transactions/activity`, payload);
      setAllRows(res.data.rows || []);

      setPage(1);
      setSortField(null);
      setSortDir("asc");
    } catch (err) {
      console.error("Error loading activity:", err);
    } finally {
      setLoadingReport(false);
    }
  };

  const filteredRows = useMemo(() => {
    let data = [...allRows];
    if (goalName !== "ALL") {
      data = data.filter(
        (r) => r.fromGoal === goalName || r.toGoal === goalName,
      );
    }
    if (type !== "ALL") {
      data = data.filter((r) => r.type === type);
    }
    return data;
  }, [allRows, goalName, type]);

  const overallTotal = useMemo(() => {
    return allRows.reduce((sum, r) => sum + r.amount, 0);
  }, [allRows]);

  const filteredTotal = useMemo(() => {
    return filteredRows.reduce((sum, r) => sum + r.amount, 0);
  }, [filteredRows]);

  const sorted = useMemo(() => {
    const data = [...filteredRows];
    if (!sortField) return data;

    return data.sort((a, b) => {
      if (sortField === "date") {
        const diff = new Date(a.date) - new Date(b.date);
        return sortDir === "asc" ? diff : -diff;
      }
      if (sortField === "type") {
        const diff = a.type.localeCompare(b.type);
        return sortDir === "asc" ? diff : -diff;
      }
      if (sortField === "amount") {
        const diff = a.amount - b.amount;
        return sortDir === "asc" ? diff : -diff;
      }
      return 0;
    });
  }, [filteredRows, sortField, sortDir]);

  const paginated = useMemo(() => {
    return sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [sorted, page]);

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
  if (goalList.length === 0 && yearList.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          No Goals or Budget found. Please create a Goal and Budget first.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ backgroundColor: "#375462", p: 1, color: "white", mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} lineHeight={1}>
          Goal Activity Report
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
        {allRows.length === 0 ? (
          <Typography variant="body1">
            No report data loaded. Choose filters and click Load.
          </Typography>
        ) : (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography fontWeight={600}>Goal :</Typography>
              <Select
                size="small"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                sx={{ minWidth: 150, maxWidth: 150, ml: 1, marginTop: 0 }}
              >
                <MenuItem value="ALL">ALL Goals</MenuItem>
                {goalList.map((g) => (
                  <MenuItem key={g.goalId} value={g.goalName}>
                    {g.goalName}
                  </MenuItem>
                ))}
              </Select>
              <Typography fontWeight={600} ml={1}>
                Transaction Type :
              </Typography>
              <Select
                size="small"
                value={type}
                onChange={(e) => setType(e.target.value)}
                sx={{ minWidth: 150, maxWidth: 150, ml: 1, marginTop: 0 }}
              >
                <MenuItem value="ALL">ALL Types</MenuItem>
                <MenuItem value="TRANSFER">Transfer</MenuItem>
                <MenuItem value="WITHDRAWAL">Withdrawal</MenuItem>
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
                  width: 500,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Filters Applied :
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Goal = {goalName}
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Transaction Type = {type}
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
                  <Box display={"flex"}>
                    <Typography variant="body2">
                      Overall Amount : &nbsp;
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      ${overallTotal.toFixed(2)}
                    </Typography>
                  </Box>
                }
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
                      onClick={() => toggleSort("date")}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        backgroundColor: "#cde1ea",
                      }}
                    >
                      Date {sortField !== "date" && "⬍"}
                      {sortField === "date" && (sortDir === "asc" ? "▲" : "▼")}
                    </TableCell>
                    <TableCell
                      onClick={() => toggleSort("type")}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        backgroundColor: "#cde1ea",
                      }}
                    >
                      Type {sortField !== "type" && "⬍"}
                      {sortField === "type" && (sortDir === "asc" ? "▲" : "▼")}
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, backgroundColor: "#cde1ea" }}
                    >
                      From
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, backgroundColor: "#cde1ea" }}
                    >
                      To
                    </TableCell>
                    <TableCell
                      onClick={() => toggleSort("amount")}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        backgroundColor: "#cde1ea",
                      }}
                    >
                      Amount {sortField !== "amount" && "⬍"}
                      {sortField === "amount" &&
                        (sortDir === "asc" ? "▲" : "▼")}
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, backgroundColor: "#cde1ea" }}
                    >
                      Notes
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginated.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell>{r.fromGoal || "-"}</TableCell>
                      <TableCell>{r.toGoal || "-"}</TableCell>
                      <TableCell>{r.amount.toFixed(2)}</TableCell>
                      <TableCell>{r.notes}</TableCell>
                    </TableRow>
                  ))}

                  <TableRow sx={{ backgroundColor: "#cde1ea" }}>
                    <TableCell colSpan={4} sx={{ fontWeight: 700 }}>
                      Total
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      ${filteredTotal.toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
