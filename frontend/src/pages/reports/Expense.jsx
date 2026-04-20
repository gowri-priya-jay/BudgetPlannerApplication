import { useMemo, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Checkbox,
  ListItemText,
  TablePagination,
  Paper,
  Grid,
} from "@mui/material";

const monthOrder = [
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

export default function Expense({ rows }) {
  const [selectedCategories, setSelectedCategories] = useState(["ALL"]);
  const [activeTab, setActiveTab] = useState(0);

  const [itemFilters, setItemFilters] = useState({});

  const [page, setPage] = useState(0);
  const rowsPerPage = 12;

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setPage(0);
  };

  const categoryColors = {
    Food: "#8BC34A",
    Home: "#4DB6AC",
    Shopping: "#9575CD",
    Transportation: "#4FC3F7",
    Entertainment: "#FFB74D",
    Medical: "#E57373",
    Subscription: "#64B5F6",
    Others: "#90A4AE",
  };

  const expenseItemColors = {
    Groceries: "#efc1c6",
    Woolies: "#ead4bb",
    "Non-Veg": "#eaeaa0",
    Cash: "#bdebc7",
    Rent: "#c6def0",
    Utilities: "#d7cef8",
    "Wi-Fi": "#f1c4e8",
    Clothing: "#bfe3de",
    Electronics: "#e0bfc8",
    "Home Goods": "#a5cae1",
    "Gifts & Toys": "#c2bca3",
    "Personal Care": "#d1bee2",
    Movies: "#e5d6b6",
    Outing: "#d8c0ad",
    Hobbies: "#b6d4dc",
    "Eating Out": "#c4a7ae",
    "Doctor Visits": "#aab6cc",
    Medications: "#C8F7C5",
    "Public Transport": "#d4b5bf",
    Uber: "#adb2d4",
    "Mobile Recharge": "#FFE0CC",
    Subscriptions: "#E1F5FE",
    Miscellaneous: "#F3E5F5",
  };

  const allCategories = useMemo(
    () => Array.from(new Set(rows.map((r) => r.category))),
    [rows],
  );

  const visibleCategories = selectedCategories.includes("ALL")
    ? allCategories
    : selectedCategories;

  const getItemsForCategory = (category) =>
    Array.from(
      new Set(rows.filter((r) => r.category === category).map((r) => r.item)),
    );

  const categoryOverallTotals = useMemo(() => {
    const totals = {};

    visibleCategories.forEach((cat) => {
      const filtered = rows.filter((r) => r.category === cat);

      const planned = filtered.reduce((sum, r) => sum + (r.planned ?? 0), 0);
      const actual = filtered.reduce((sum, r) => sum + (r.actual ?? 0), 0);

      totals[cat] = { planned, actual };
    });

    return totals;
  }, [rows, visibleCategories]);

  const filteredRows = useMemo(() => {
    const category = visibleCategories[activeTab];
    const itemFilter = itemFilters[category] || "ALL";

    let data = rows.filter(
      (r) =>
        r.category === category &&
        (itemFilter === "ALL" || r.item === itemFilter),
    );

    if (sortColumn) {
      data = [...data].sort((a, b) => {
        if (sortColumn === "month") {
          const aIndex = monthOrder.indexOf(a.month);
          const bIndex = monthOrder.indexOf(b.month);
          return sortDirection === "asc" ? aIndex - bIndex : bIndex - aIndex;
        }

        if (sortColumn === "planned" || sortColumn === "actual") {
          return sortDirection === "asc"
            ? (a[sortColumn] ?? 0) - (b[sortColumn] ?? 0)
            : (b[sortColumn] ?? 0) - (a[sortColumn] ?? 0);
        }

        return 0;
      });
    }

    return data;
  }, [
    rows,
    visibleCategories,
    activeTab,
    itemFilters,
    sortColumn,
    sortDirection,
  ]);

  const filteredTotals = useMemo(() => {
    const planned = filteredRows.reduce((sum, r) => sum + (r.planned ?? 0), 0);
    const actual = filteredRows.reduce((sum, r) => sum + (r.actual ?? 0), 0);
    return { planned, actual };
  }, [filteredRows]);

  const overallExpenseTotals = useMemo(() => {
    const categoriesToInclude = selectedCategories.includes("ALL")
      ? allCategories
      : selectedCategories;
    const filtered = rows.filter((r) =>
      categoriesToInclude.includes(r.category),
    );

    const totalPlanned = filtered.reduce((sum, r) => sum + (r.planned ?? 0), 0);
    const totalActual = filtered.reduce((sum, r) => sum + (r.actual ?? 0), 0);

    return { totalPlanned, totalActual };
  }, [rows, selectedCategories, allCategories]);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleItemFilterChange = (category, value) => {
    setItemFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
    setPage(0);
  };

  return (
    <Box>
      <Grid container spacing={0.5}>
        <Grid size={3.5}>
          <Box display={"flex"} alignItems={"center"}>
            <Typography fontWeight={600}>Category : </Typography>
            <Select
              multiple
              size="small"
              value={selectedCategories}
              renderValue={(selected) => selected.join(", ")}
              sx={{ minWidth: "200px", maxWidth: "200px", ml: 1, marginTop: 0 }}
            >
              <MenuItem
                value="ALL"
                onClick={() => {
                  setSelectedCategories(["ALL"]);
                  setActiveTab(0);
                  setItemFilters({});
                }}
              >
                <Checkbox
                  checked={
                    selectedCategories.length === 1 &&
                    selectedCategories[0] === "ALL"
                  }
                />
                <ListItemText primary="ALL" />
              </MenuItem>

              {allCategories.map((c) => (
                <MenuItem
                  key={c}
                  value={c}
                  onClick={() => {
                    let newCats = [...selectedCategories];

                    if (newCats.includes("ALL")) newCats = [];

                    if (newCats.includes(c)) {
                      newCats = newCats.filter((x) => x !== c);
                    } else {
                      newCats.push(c);
                    }

                    if (newCats.length === 0) newCats = ["ALL"];

                    setSelectedCategories(newCats);

                    const newFilters = {};
                    newCats.forEach((cat) => {
                      if (cat !== "ALL")
                        newFilters[cat] = itemFilters[cat] || "ALL";
                    });
                    setItemFilters(newFilters);

                    setActiveTab(0);
                  }}
                >
                  <Checkbox checked={selectedCategories.includes(c)} />
                  <ListItemText primary={c} />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
        <Grid size={8.5}>
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
            <Typography variant="body2" fontWeight={600}>
              Filters Applied :
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              Expense Category = {selectedCategories.join(", ")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
        <Chip
          label={
            <Box display="flex">
              <Typography variant="caption">
                Total Planned Expense : &nbsp;
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                ${overallExpenseTotals.totalPlanned.toFixed(2)}
              </Typography>
            </Box>
          }
        />
        <Chip
          label={
            <Box display="flex">
              <Typography variant="caption">
                Total Actual Expense: &nbsp;
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                ${overallExpenseTotals.totalActual.toFixed(2)}
              </Typography>
            </Box>
          }
          sx={{
            ml: 2,
          }}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Box sx={{ flexGrow: 1, display: "flex" }}>
          <Tabs
            orientation="vertical"
            value={activeTab}
            onChange={(e, v) => {
              setActiveTab(v);
              setPage(0);
            }}
            sx={{
              borderRight: 1,
              borderColor: "divider",
              minWidth: 150,
              backgroundColor: "transparent",
            }}
          >
            {visibleCategories.map((c) => (
              <Tab
                key={c}
                label={c}
                sx={{
                  color: categoryColors[c] || "#333",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                }}
              />
            ))}
          </Tabs>

          <Box sx={{ flexGrow: 1, ml: 1 }}>
            {visibleCategories.length > 0 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" fontWeight={600}>
                      Expense Item :
                    </Typography>
                    <Select
                      size="small"
                      value={itemFilters[visibleCategories[activeTab]] || "ALL"}
                      onChange={(e) =>
                        handleItemFilterChange(
                          visibleCategories[activeTab],
                          e.target.value,
                        )
                      }
                      sx={{
                        minWidth: 200,
                        maxWidth: "200px",
                        ml: 1,
                        marginTop: 0,
                      }}
                    >
                      <MenuItem value="ALL">All Items</MenuItem>

                      {getItemsForCategory(visibleCategories[activeTab]).map(
                        (i) => (
                          <MenuItem key={i} value={i}>
                            {i}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" lineHeight={1}>
                      Category : {visibleCategories[activeTab]}
                    </Typography>
                    <Chip
                      label={`Planned : $${Number(
                        categoryOverallTotals[visibleCategories[activeTab]]
                          .planned,
                      ).toFixed(2)}`}
                      sx={{
                        backgroundColor:
                          categoryColors[visibleCategories[activeTab]] + "33",
                        fontSize: "10px",
                        height: "20px",
                        fontWeight: 600,
                        ml: 1,
                      }}
                    />
                    <Chip
                      label={`Actual : $${Number(
                        categoryOverallTotals[visibleCategories[activeTab]]
                          .actual,
                      ).toFixed(2)}`}
                      sx={{
                        backgroundColor:
                          categoryColors[visibleCategories[activeTab]] + "33",
                        fontSize: "10px",
                        height: "20px",
                        fontWeight: 600,
                        ml: 1,
                      }}
                    />
                  </Box>

                  <Box>
                    <TablePagination
                      component="div"
                      count={filteredRows.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={12}
                      rowsPerPageOptions={[]}
                      labelRowsPerPage=""
                      sx={{
                        "& .MuiTablePagination-toolbar": {
                          minHeight: "30px",
                          height: "30px",
                          padding: "4px",
                        },
                        "& .MuiTablePagination-displayedRows": {
                          margin: 0,
                          fontSize: "12px",
                        },
                        "& .MuiIconButton-root": {
                          padding: "2px",
                          fontSize: "12px",
                        },
                      }}
                    />
                  </Box>
                </Box>
                <Paper sx={{ p: 0.5, mt: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          onClick={() => handleSort("month")}
                          sx={{ cursor: "pointer", fontWeight: 600 }}
                        >
                          Month {sortColumn !== "month" && "⬍"}
                          {sortColumn === "month" &&
                            (sortDirection === "asc" ? "▲" : "▼")}
                        </TableCell>

                        <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>

                        <TableCell
                          onClick={() => handleSort("planned")}
                          sx={{ cursor: "pointer", fontWeight: 600 }}
                        >
                          Planned {sortColumn !== "planned" && "⬍"}
                          {sortColumn === "planned" &&
                            (sortDirection === "asc" ? "▲" : "▼")}
                        </TableCell>

                        <TableCell
                          onClick={() => handleSort("actual")}
                          sx={{ cursor: "pointer", fontWeight: 600 }}
                        >
                          Actual {sortColumn !== "actual" && "⬍"}
                          {sortColumn === "actual" &&
                            (sortDirection === "asc" ? "▲" : "▼")}
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredRows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        .map((r, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{r.month}</TableCell>
                            <TableCell>
                              <Chip
                                label={r.item}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    expenseItemColors[r.item] || "#e0e0e0",
                                  fontWeight: 600,
                                  color: "black",
                                  fontSize: "10px",
                                  height: "20px",
                                }}
                              />
                            </TableCell>
                            <TableCell>{r.planned ?? 0}</TableCell>
                            <TableCell>{r.actual ?? 0}</TableCell>
                          </TableRow>
                        ))}
                      <TableRow sx={{ backgroundColor: "#cde1ea" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          ${filteredTotals.planned.toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          ${filteredTotals.actual.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
