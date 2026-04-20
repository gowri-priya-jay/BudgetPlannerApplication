import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Divider, Grid, Typography, Alert } from "@mui/material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import BudgetCard from "../../components/Budget/BudgetCard";
import API from "../../services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AllocationDialog from "../../components/Budget/AllocationDialog";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";
import LatestBudgetSection from "../../components/Dashboard/LatestBudgetSection";

const BudgetDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [alertMessage, setAlertMessage] = useState(successMessage || "");
  const [budgetList, setBudgetList] = useState([]);
  const [openAllocationDialog, setOpenAllocationDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [goals, setGoals] = useState([]);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [latestBudget, setLatestBudget] = useState(null);

  useEffect(() => {
    if (location.state?.successMessage) {
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await API.get("/goal/getAllGoals");
      setGoals(res.data);
    } catch (err) {
      console.log("Error fetching goals:", err);
    }
  };

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const res = await API.get("/budget/getAllBudgets");
      setBudgetList(res.data);
      const budRes = await API.get("/budget/getLatestCompletedBudget");
      setLatestBudget(budRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      fetchBudget();
      fetchGoals();
    };
    load();
  }, []);

  const groupedByYear = budgetList.reduce((acc, item) => {
    const year = item.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {});

  const years = React.useMemo(() => {
    return Object.keys(groupedByYear).map((y) => Number(y));
  }, [groupedByYear]);

  // Accordion state
  const [expanded, setExpanded] = useState(false);

  // Handle switching
  const handleChange = (year) => (event, isExpanded) => {
    setExpanded(isExpanded ? year : false);
  };

  // Navigation handlers
  const handleView = (budget) => navigate(`/budget/${budget.budgetId}`);
  const handleEdit = (budget) => navigate(`/budget/edit/${budget.budgetId}`);
  const handleDelete = (budget) => {
    setSelectedBudget(budget);
    setDeleteConfirmDialog(true);
  };

  const handleDeleteBudget = async () => {
    try {
      await API.delete(`/budget/delete/${selectedBudget.budgetId}`);
      setDeleteConfirmDialog(false);
      fetchBudget();
      setAlertMessage("Budget deleted successfully");
      setShowAlert(true);
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  const handleAllocate = (budget) => {
    setSelectedBudget(budget);
    setOpenAllocationDialog(true);
  };
  const handleReallocate = (budget) => {
    setSelectedBudget(budget);
    setOpenAllocationDialog(true);
  };

  const handleCloseAllocationDialog = () => {
    setOpenAllocationDialog(false);
    setSelectedBudget(null);
  };

  const handleSaveAllocation = async (data) => {
    try {
      console.log("Saving allocation:", data);
      await API.post("/allocations/saveAllocation", data);
      setOpenAllocationDialog(false);
      fetchBudget();
    } catch (err) {
      console.error("Error saving allocation:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600}>
        Budgets
      </Typography>
      <Divider flexItem sx={{ mt: 1, mb: 1 }} />
      <Box>
        {alertMessage && showAlert && (
          <Alert
            severity="success"
            onClose={() => setShowAlert(false)}
            sx={{ mb: 2 }}
          >
            {alertMessage}
          </Alert>
        )}
      </Box>
      {loading ? (
        <Typography variant="subtitle1">Loading...</Typography>
      ) : budgetList.length === 0 ? (
        <Typography variant="subtitle1">No budgets found</Typography>
      ) : (
        <Box>
          <Box>
            {years.map((year) => (
              <Accordion
                key={year}
                expanded={expanded === year}
                onChange={handleChange(year)}
                disableGutters
                elevation={0}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                >
                  <Typography fontWeight={600} fontSize={15}>
                    {year}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    {groupedByYear[year].map((budget) => (
                      <Grid key={budget.budgetId}>
                        <BudgetCard
                          budget={budget}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onAllocate={handleAllocate}
                          onReallocate={handleReallocate}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      )}
      {/* Allocation Dialog */}
      <AllocationDialog
        open={openAllocationDialog}
        onClose={handleCloseAllocationDialog}
        budget={selectedBudget}
        goals={goals}
        onSave={handleSaveAllocation}
      />
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmDialog}
        title="Delete Budget"
        message="This budget and its related data will be permanently deleted. Do you want to continue?"
        onClose={() => setDeleteConfirmDialog(false)}
        onConfirm={handleDeleteBudget}
      />
      <Box sx={{ mt: 1}}>
        <Typography variant="h6">Latest Completed Budget</Typography>
        <Divider flexItem sx={{ my: 1 }} />
        <LatestBudgetSection budget={latestBudget} />
      </Box>
    </Box>
  );
};

export default BudgetDashboard;
