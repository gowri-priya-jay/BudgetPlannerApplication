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

export default function Income({ rows }) {
  const [filterItem, setFilterItem] = useState("ALL");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const rowsPerPage = 12;

  const income_colors = {
    Salary: "#deaecf",
    Others: "#b7dad7",
  };

  const getChipColor = (name) => income_colors[name] || "#607D8B";

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
      filterItem === "ALL" ? true : r.incomeName === filterItem,
    );
  }, [rows, filterItem]);

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

  const totalActual = rows.reduce((sum, r) => sum + (r.actual || 0), 0);
  const totalPlanned = rows.reduce((sum, r) => sum + (r.planned || 0), 0);

  const incomeItems = useMemo(
    () => Array.from(new Set(rows.map((r) => r.incomeName))),
    [rows],
  );

  const filteredTotalActual = sorted.reduce(
    (sum, r) => sum + (r.actual || 0),
    0,
  );
  const filteredTotalPlanned = sorted.reduce(
    (sum, r) => sum + (r.planned || 0),
    0,
  );

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Box display={"flex"} alignItems={"center"}>
            <Typography fontWeight={600}>Income Item :</Typography>
            <Select
              size="small"
              value={filterItem}
              onChange={(e) => {
                setFilterItem(e.target.value);
                setPage(1);
              }}
              sx={{
                minWidth: 225,
                maxWidth: 225,
                ml: 1,
                marginTop: 0,
              }}
            >
              <MenuItem value="ALL">ALL</MenuItem>
              {incomeItems.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
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
              height: "30px",
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              Filters Applied :
            </Typography>
            <Typography variant="subtitle2" sx={{ ml: 2 }}>
              Income Item = {filterItem}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Chip
            label={
              <Box display="flex">
                <Typography variant="caption">
                  Total Planned Income : &nbsp;
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
                  Total Actual Income : &nbsp;
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  ${totalActual.toFixed(2)}
                </Typography>
              </Box>
            }
            sx={{
              ml: 1,
            }}
          />
        </Box>
        <Pagination
          count={Math.ceil(sorted.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          size="small"
          sx={{ my: 0.5, display: "flex", justifyContent: "end" }}
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

              <TableCell sx={{ fontWeight: 600 }}>Income Item</TableCell>

              <TableCell
                onClick={() => toggleSort("planned")}
                sx={{ cursor: "pointer", fontWeight: 600 }}
              >
                Planned{" "}
                {sortField !== "planned" ? "⬍" : sortDir === "asc" ? "▲" : "▼"}
              </TableCell>

              <TableCell
                onClick={() => toggleSort("actual")}
                sx={{ cursor: "pointer", fontWeight: 600 }}
              >
                Actual{" "}
                {sortField !== "actual" ? "⬍" : sortDir === "asc" ? "▲" : "▼"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell>{r.month}</TableCell>
                <TableCell>
                  <Chip
                    label={r.incomeName}
                    size="small"
                    sx={{
                      backgroundColor: getChipColor(r.incomeName),
                      fontWeight: 600,
                      fontSize: "10px",
                      height: "20px",
                    }}
                  />
                </TableCell>
                <TableCell>{r.planned ?? 0}</TableCell>
                <TableCell>{r.actual ?? 0}</TableCell>
              </TableRow>
            ))}
            {sorted.length > 0 && (
              <TableRow sx={{ backgroundColor: "#cde1ea" }}>
                <TableCell colSpan={2} sx={{ fontWeight: 600 }}>
                  Totals
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {filteredTotalPlanned.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {filteredTotalActual.toFixed(2)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
