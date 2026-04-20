import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo.png";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CategoryIcon from "@mui/icons-material/Category";
import ReportIcon from '@mui/icons-material/AnalyticsRounded';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import FlagCircleRoundedIcon from '@mui/icons-material/FlagCircleRounded';

const drawerWidth = 240;

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [openBudget, setOpenBudget] = useState(() =>
    currentPath.startsWith("/budget"),
  );

  const [openReport, setOpenReport] = useState(() =>
    currentPath.startsWith("/reports"),
  );
  const username = localStorage.getItem("fullName");
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#375462",
          color: "white",
        },
      }}
    >
      <Box>
        <Box sx={{ display: "flex",alignItems: "center", p: 1 }}>
          <img
            src={logo}
            alt="Finances Symbol"
            style={{ width: "25px", height: "25px" }}
          ></img>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            Budget Planner
          </Typography>
        </Box>
        <Divider flexItem sx={{borderColor: "#dfdfdf"}}/>
        <List>
          {/* Dashboard */}
          <ListItemButton
            component={Link}
            to="/dashboard"
            selected={currentPath === "/dashboard"}
          >
            <ListItemIcon>
              <DashboardIcon sx={{color:"white"}} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          {/* Budget Parent */}
          <ListItemButton onClick={() => setOpenBudget(!openBudget)}>
            <ListItemIcon>
              <AccountBalanceWalletIcon sx={{color:"white"}} />
            </ListItemIcon>
            <ListItemText primary="Budget" />
            {openBudget ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          {/* Budget Submenu */}
          <Collapse in={openBudget} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/budgets"
                selected={currentPath === "/budgets"}
              >
                <ListItemIcon>
                  <ListAltIcon sx={{color:"white"}} />
                </ListItemIcon>
                <ListItemText primary="Budget List" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/budget/new"
                selected={currentPath === "/budget/new"}
              >
                <ListItemIcon>
                  <AddCircleOutlineIcon sx={{color:"white"}} />
                </ListItemIcon>
                <ListItemText primary="New Budget" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Saving Goals */}
          <ListItemButton
            component={Link}
            to="/goal"
            selected={currentPath === "/goal"}
          >
            <ListItemIcon>
              <FlagCircleRoundedIcon  sx={{color:"white"}}/>
            </ListItemIcon>
            <ListItemText primary="Goals" />
          </ListItemButton>
          {/* Finance setup */}
          <ListItemButton
            component={Link}
            to="/settings"
            selected={currentPath === "/settings"}
          >
            <ListItemIcon>
              <CategoryIcon sx={{color:"white"}} />
            </ListItemIcon>
            <ListItemText primary="Finance Setup" />
          </ListItemButton>
          {/* Reports */}
          <ListItemButton onClick={() => setOpenReport(!openReport)}>
            <ListItemIcon>
              <ReportIcon sx={{color:"white"}} />
            </ListItemIcon>
            <ListItemText primary="Reports" />
            {openReport ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          {/* Reports Submenu */}
          <Collapse in={openReport} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/reports/annual-report"
                selected={currentPath === "/annual-report"}
              >
                <ListItemIcon>
                  <SummarizeRoundedIcon sx={{color:"white"}} />
                </ListItemIcon>
                <ListItemText primary="Annual Report" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/reports/budgetReport"
                selected={currentPath === "/budgetReport"}
              >
                <ListItemIcon>
                  <AssessmentRoundedIcon sx={{color:"white"}} />
                </ListItemIcon>
                <ListItemText primary="Budget Report" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/reports/goalReport"
                selected={currentPath === "/goalReport"}
              >
                <ListItemIcon>
                  <FlagCircleRoundedIcon sx={{color:"white"}} />
                </ListItemIcon>
                <ListItemText primary="Goal Report" />
              </ListItemButton>
            </List>
          </Collapse>

        </List>
      </Box>
      <Box sx={{ p: 1 }}>
        <Divider sx={{borderColor: "#dfdfdf", mb:1}}/>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          {username}
        </Typography>
        <ListItemButton
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          sx={{
            borderRadius: 1,
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{color:"white"}} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
