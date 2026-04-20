import { Grid } from "@mui/material";
import QuickStatCard from "./QuickStatCard";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FlagIcon from "@mui/icons-material/Flag";

export default function QuickStatsRow({ accounts, goals }) {
  const safeAccounts = accounts || [];
  const safeGoals = goals || [];

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.currentBalance || 0),
    0,
  );

  const accountCount = safeAccounts.length;
  const activeGoals = safeGoals.length;

  return (
    <Grid container spacing={1} sx={{ mt: 2 }}>
      <Grid size={3}>
        <QuickStatCard
          icon={<AccountBalanceIcon />}
          label="Total Balance"
          value={`$${totalBalance.toFixed(2)}`}
        />
      </Grid>

      <Grid size={3}>
        <QuickStatCard
          icon={<SavingsIcon />}
          label="Accounts"
          value={accountCount}
        />
      </Grid>

      <Grid size={3}>
        <QuickStatCard
          icon={<FlagIcon />}
          label="Active Goals"
          value={activeGoals}
        />
      </Grid>
    </Grid>
  );
}
