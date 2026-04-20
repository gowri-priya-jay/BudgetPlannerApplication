import { Card, CardContent, Typography, Box } from "@mui/material";

export default function QuickStatCard({ icon, label, value, color }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        p: 0.5,
        backgroundColor: color || "background.paper",
        minWidth: "150px",
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 1,p: 0}}>
        <Box sx={{ fontSize: 28, color: "text.secondary" }}>{icon}</Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={700} color="#497286">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}