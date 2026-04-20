import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExpenseIcon from "@mui/icons-material/ArrowDownwardRounded";
import API from "../../services/api";
import LeftAlignedLabel from "../LeftAlignedLabel";
import DeleteConfirmDialog from "../common/DeleteConfirmDialog";

export default function ExpenseItems({ onActionComplete }) {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const loadData = useCallback(async () => {
    const res = await API.get("/master/getExpenseItems");
    setRows(res.data);
  }, []);

  const loadCategories = async () => {
    const res = await API.get("/master/getExpenseCategories");
    setCategories(res.data);
  };

  useEffect(() => {
    const load = async () => {
      await loadData();
      await loadCategories();
    };
    load();
  }, [loadData]);

  // Reset dialog state whenever it closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setExpenseName("");
        setCategoryId("");
        setEditId(null);
        setError("");
        setCategoryError("");
      }, 0);
    }
  }, [open]);

  const openAdd = () => {
    setExpenseName("");
    setCategoryId("");
    setEditId(null);
    setOpen(true);
    setError("");
    setCategoryError("");
  };

  const openEdit = (row) => {
    setExpenseName(row.expenseName);
    setCategoryId(row.categoryId);
    setEditId(row.expenseId);
    setOpen(true);
    setError("");
    setCategoryError("");
  };

  const handleSave = async () => {
    setError("");
    const isDuplicate = rows.some(
      (r) =>
        r.expenseName.toLowerCase() === expenseName.toLowerCase() &&
        r.expenseId !== editId,
    );
    if (isDuplicate) {
      setError("Expense Item name already exists");
      return;
    }
    if (!expenseName.trim()) {
      setError("Expense name is required");
      return;
    }
    if (!categoryId) {
      setCategoryError("Category is required");
      return;
    }
    const payload = { expenseName, categoryId };
    if (editId) {
      await API.put(`/master/updateExpenseItem/${editId}`, payload);
      onActionComplete("Expense Item updated successfully");
    } else {
      await API.post("/master/createExpenseItem", payload);
      onActionComplete("Expense Item created successfully");
    }
    setOpen(false);
    loadData();
  };

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  //For Delete confirmation Dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await API.delete(`/master/deleteExpenseItem/${deleteId}`);
    setConfirmOpen(false);
    onActionComplete("Expense Item deleted successfully");
    loadData();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="subtitle1">Expense Items</Typography>
          <Typography variant="caption" color="text.secondary">
            Manage your expense items and assign them to categories for better
            tracking.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add
        </Button>
      </Box>
      <Divider flexItem />
      <Box sx={{ p: 1 }}>
        <Chip label={`Total Items : ${rows.length}`} />
        <Paper sx={{ p: 1, borderRadius: 2, maxWidth: 500, mt: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Expense Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell width="120px">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.expenseId}>
                  <TableCell>{row.expenseName}</TableCell>
                  <TableCell>
                    {
                      categories.find((c) => c.categoryId === row.categoryId)
                        ?.categoryName
                    }
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => openEdit(row)}>
                      <EditIcon sx={{ fontSize: "15px", color: "#375462" }} />
                    </IconButton>
                    <IconButton onClick={() => askDelete(row.expenseId)}>
                      <DeleteIcon sx={{ fontSize: "15px", color: "#e9666e" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      </Box>
      {/* Add and Edit Expense Item Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          <ExpenseIcon sx={{ fontSize: "15px", color: "primary" }} />
          {editId ? "Edit Expense Item" : "Add Expense Item"}
        </DialogTitle>

        <DialogContent>
          <LeftAlignedLabel required>Expense Name</LeftAlignedLabel>
          <TextField
            fullWidth
            sx={{ mt: 1, mb: 1 }}
            value={expenseName}
            onChange={(e) => {
              setExpenseName(e.target.value);
              setError("");
            }}
            error={Boolean(error)}
            helperText={error}
          />
          <LeftAlignedLabel required>Expense Category</LeftAlignedLabel>
          <TextField
            fullWidth
            select
            sx={{ mt: 1 }}
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setCategoryError("");
            }}
            error={Boolean(categoryError)}
            helperText={categoryError || " "}
          >
            {categories.map((c) => (
              <MenuItem key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <Divider flexItem />
        <DialogActions>
          <Button fullWidth onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button fullWidth variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Doalog */}
      <DeleteConfirmDialog
        open={confirmOpen}
        title="Delete Expense Item"
        message="This Expense Item is linked to multiple records. Deleting it will
          remove all associated data. Do you want to continue?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
