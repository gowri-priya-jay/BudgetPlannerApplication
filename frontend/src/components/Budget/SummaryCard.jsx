import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

export default function SummaryCard({ title, Icon, values }) {
  return (
    <Card sx={{ borderRadius: 2, maxWidth: "150px" }}>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {Icon && <Icon />}
            <Typography>{title}</Typography>
          </Box>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2">Planned</Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              ${values.planned}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2">Actual</Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              ${values.actual}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
