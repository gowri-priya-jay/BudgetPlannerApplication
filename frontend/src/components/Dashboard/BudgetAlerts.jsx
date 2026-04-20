import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BudgetAlerts({ budgets = [] }) {
  const navigate = useNavigate();
  const alerts = budgets.filter(
    (b) =>
      b.allocationStatus === "Not Allocated" ||
      b.allocationStatus === "Needs Reallocation",
  );

  if (alerts.length === 0) {
    return (
      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        No actions needed for existing budgets
      </Typography>
    );
  }

  return (
    <Card sx={{ mt: 1, borderLeft: "5px solid #f57c00" }}>
      <CardContent>
        {alerts.map((b) => (
          <Box
            key={b.budgetId}
            onClick={() => navigate(`/budget/${b.budgetId}`)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              mt: 1,
              borderRadius: 2,
              backgroundColor: "#fff7e6",
            }}
          >
            <Box>
              <Typography fontWeight={600}>
                {b.month} {b.year}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Savings : <strong>  ${(b.actualSavings.toFixed(2))}</strong>
              </Typography>
            </Box>

            <Chip
              label={b.allocationStatus}
              sx={{
                backgroundColor:
                  b.allocationStatus === "Not Allocated"
                    ? "#e9666e"
                    : "#ffab2e",
                color: "#fff",
              }}
              size="small"
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
