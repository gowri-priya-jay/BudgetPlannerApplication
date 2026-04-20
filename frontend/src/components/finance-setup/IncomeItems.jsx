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
import IncomeIcon from "@mui/icons-material/ArrowUpwardRounded";
import API from "../../services/api";
import LeftAlignedLabel from "../LeftAlignedLabel";
import DeleteConfirmDialog from "../common/DeleteConfirmDialog";

export default function IncomeItems({ onActionComplete }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [incomeName, setIncomeName] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const loadData = useCallback(async () => {
    const res = await API.get("/master/getIncomeItems");
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
        setIncomeName("");
        setEditId(null);
        setError("");
      }, 0);
    }
  }, [open]);

  const openAdd = () => {
    setIncomeName("");
    setEditId(null);
    setOpen(true);
    setError("");
  };

  const openEdit = (row) => {
    setIncomeName(row.incomeName);
    setEditId(row.incomeId);
    setOpen(true);
    setError("");
  };

  const handleSave = async () => {
    setError("");
    const isDuplicate = rows.some(
      (r) =>
        r.incomeName.toLowerCase() === incomeName.toLowerCase() &&
        r.incomeId !== editId,
    );
    if (isDuplicate) {
      setError("Income Item name already exists");
      return;
    }
    if (!incomeName.trim()) {
      setError("Income name is required");
      return;
    }
    if (editId) {
      await API.put(`/master/updateIncomeItem/${editId}`, { incomeName });
      onActionComplete("Income Item Updated successfully");
    } else {
      await API.post("/master/createIncomeItem", { incomeName });
      onActionComplete("Income Item created successfully");
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
    await API.delete(`/master/deleteIncomeItem/${deleteId}`);
    setConfirmOpen(false);
    onActionComplete("Income Item deleted successfully");
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
          <Typography variant="subtitle1">Income Items</Typography>
          <Typography variant="caption" color="text.secondary">
            These are the income sources you use in your monthly budgets. Add
            items like salary, freelance work, or other recurring income.
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
                <TableCell>Income Name</TableCell>
                <TableCell width="120px">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.incomeId}>
                  <TableCell>{row.incomeName}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => openEdit(row)}>
                      <EditIcon sx={{ fontSize: "15px", color: "#375462" }} />
                    </IconButton>
                    <IconButton onClick={() => askDelete(row.incomeId)}>
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
          <IncomeIcon sx={{ fontSize: "15px", color: "primary" }} />
          {editId ? "Edit Income Item" : "Add Income Item"}
        </DialogTitle>

        <DialogContent>
          <LeftAlignedLabel required>Income Name</LeftAlignedLabel>
          <TextField
            fullWidth
            sx={{ mt: 1 }}
            value={incomeName}
            onChange={(e) => {
              setIncomeName(e.target.value);
              setError("");
            }}
            error={Boolean(error)}
            helperText={error || " "}
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
        title="Delete Income Item"
        message="This Income Item is linked to multiple records. Deleting it will
          remove all associated data. Do you want to continue??"
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
