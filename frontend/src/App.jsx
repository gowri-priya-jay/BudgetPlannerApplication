import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicRoute from "./components/layout/PublicRoute";
import Layout from "./components/layout/Layout";

// Auth pages
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";

// Dashboard
import DashboardPage from "./pages/dashboard/DashboardPage";

// // Budgets
import BudgetDashboard from "./pages/budget/BudgetDashboard";
import NewBudgetPage from "./pages/budget/NewBudgetPage";
import BudgetEditPage from "./pages/budget/BudgetEditPage";
import BudgetDetailPage from "./pages/budget/BudgetDetailPage";

// Goals
import GoalsDashboardPage from "./pages/goals/GoalsDashboardPage";

//Finance setup
import FinanceSetupPage from "./pages/finance-setup/FinanceSetupPage";

//Reports
import ReportDashboardPage from "./pages/reports/ReportDashboardPage";
import BudgetReport from "./pages/reports/BudgetReport";
import GoalReport from "./pages/reports/GoalReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Budgets */}
            <Route path="/budgets" element={<BudgetDashboard />} />
            <Route path="/budget/new" element={<NewBudgetPage />} />
            <Route path="/budget/:budgetId" element={<BudgetDetailPage />} />
            <Route path="/budget/edit/:budgetId" element={<BudgetEditPage />} />

            {/* Goals */}
            <Route path="/goal" element={<GoalsDashboardPage />} />

            {/* Master Data */}
            <Route path="/settings" element={<FinanceSetupPage />} />

            {/* Reports */}
            <Route path="/reports/annual-report" element={<ReportDashboardPage />} />
            <Route path="/reports/budgetReport" element={<BudgetReport />} />
            <Route path="/reports/goalReport" element={<GoalReport />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
