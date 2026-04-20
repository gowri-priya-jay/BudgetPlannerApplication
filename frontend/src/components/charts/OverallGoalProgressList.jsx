import { Card, CardContent, Typography, Box } from "@mui/material";
import GoalProgressBar from "./GoalProgressBar";

export default function OverallGoalProgressList({ goals = [] }) {
  if (!goals || goals.length === 0) {
    return (
      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        No Goals found
      </Typography>
    );
  }

  return (
    <Card sx={{ mt: 1 }}>
      <CardContent>
        {goals.map((goal) => (
          <Box key={goal.goalId} sx={{ mb: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5,
              }}
            >
              <Typography variant="subtitle2">
                Goal Name: <strong>{goal.goalName}</strong>
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {goal.savedAmount} / {goal.targetAmount} (
                {((goal.savedAmount / goal.targetAmount) * 100).toFixed(0)}%)
              </Typography>
            </Box>

            <GoalProgressBar
              saved={goal.savedAmount || 0}
              target={goal.targetAmount || 1}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
