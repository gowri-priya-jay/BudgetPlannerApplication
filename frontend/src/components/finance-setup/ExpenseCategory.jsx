import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/CategoryRounded";
import API from "../../services/api";
import LeftAlignedLabel from "../LeftAlignedLabel";
import DeleteConfirmDialog from "../common/DeleteConfirmDialog";

export default function ExpenseCategory({ onActionComplete }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const loadData = useCallback(async () => {
    const res = await API.get("/master/getExpenseCategories");
    setRows(res.data);
  }, []);

  useEffect(() => {
    const load = async () => {
      await loadData();
    };
    load();
  }, [loadData]);

  // Reset dialog state whenever it closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setCategoryName("");
        setEditId(null);
        setError("");
      }, 0);
    }
  }, [open]);

  const openAdd = () => {
    setCategoryName("");
    setEditId(null);
    setError("");
    setOpen(true);
  };

  const openEdit = (row) => {
    setCategoryName(row.categoryName);
    setEditId(row.categoryId);
    setError("");
    setOpen(true);
  };

  const handleSave = async () => {
    setError("");
    const isDuplicate = rows.some(
      (r) =>
        r.categoryName.toLowerCase() === categoryName.toLowerCase() &&
        r.categoryId !== editId,
    );
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    if (isDuplicate) {
      setError("Category name already exists");
      return;
    }

    if (editId) {
      await API.put(`/master/updateExpenseCategory/${editId}`, {
        categoryName,
      });
      onActionComplete("Category Updated successfully");
    } else {
      await API.post("/master/createExpenseCategory", { categoryName });
      onActionComplete("Category added successfully");
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
    await API.delete(`/master/deleteExpenseCategory/${deleteId}`);
    setConfirmOpen(false);
    onActionComplete("Category deleted successfully");
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
          <Typography variant="subtitle1">Expense Categories</Typography>
          <Typography variant="caption" color="text.secondary">
            Organize your expenses by grouping them into categories like Food,
            Bills, Shopping, etc.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add
        </Button>
      </Box>
      <Divider flexItem />
      <Box sx={{ p: 1 }}>
        <Chip label={`Total Items : ${rows.length}`} />
        <Paper sx={{ p: 1, borderRadius: 2, maxWidth: 400, mt: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category Name</TableCell>
                <TableCell width="120px">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.categoryId}>
                  <TableCell>{row.categoryName}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => openEdit(row)}>
                      <EditIcon sx={{ fontSize: "15px", color: "#375462" }} />
                    </IconButton>
                    <IconButton onClick={() => askDelete(row.categoryId)}>
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

      {/* Add and Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          <CategoryIcon sx={{ fontSize: "15px", color: "primary" }} />
          {editId ? "Edit Expense Category" : "Add Expense Category"}
        </DialogTitle>

        <DialogContent>
          <LeftAlignedLabel required>Category Name</LeftAlignedLabel>
          <TextField
            fullWidth
            autoFocus
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              setError("");
            }}
            error={Boolean(error)}
            helperText={error || " "}
            sx={{ mt: 1 }}
          />
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
        title="Delete Expense Category"
        message="This expense category is linked to multiple records. Deleting it will remove
          all associated data. Do you want to continue?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
