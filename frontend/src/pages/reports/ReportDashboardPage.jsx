import React, { useEffect, useState } from "react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import LeftAlignedLabel from "../../components/LeftAlignedLabel";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import API from "../../services/api";
import MonthlyTrendChart from "../../components/charts/MonthlyTrendChart";
import AnnualExpenseChart from "../../components/charts/AnnualExpenseChart";
import AnnualInsightCard from "../../components/reports/AnnualInsightCard";

const loaderOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(255,255,255,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

export default function ReportDashboardPage() {
  const [year, setYear] = useState(dayjs());
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasTried, setHasTried] = useState(false);
  const [report, setReport] = useState(null);
  const expenseChartRef = useRef(null);
  const trendChartRef = useRef(null);

  const fetchSummary = async (selectedYear) => {
    if (!selectedYear) return;
    setLoading(true);
    setHasTried(true);

    try {
      const y = selectedYear.year();
      const reportRes = await API.get(`/reports/getAnnualSummary?year=${y}`);
      setReport(reportRes.data);
    } catch (e) {
      console.error("Error loading annual summary", e);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleYearChange = (value) => {
    setYear(value);
    fetchSummary(value);
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setTimeout(async () => {
      await generatePdf();
      setIsExporting(false);
    }, 50);
  };

  const generatePdf = async () => {
    try {
      //expenseChartRef.current.chart.options.plugins.tooltip.enabled = false;
      //trendChartRef.current.chart.options.plugins.tooltip.enabled = false;
      //expenseChartRef.current.chart.update();
      //trendChartRef.current.chart.update();
      const expenseCanvas = await html2canvas(expenseChartRef.current);
      const trendCanvas = await html2canvas(trendChartRef.current);
      const expenseBase64 = expenseCanvas.toDataURL("image/png");
      const trendBase64 = trendCanvas.toDataURL("image/png");
      const res = await API.post(
        "/reports/annual-summary/pdf",
        {
          year: year.year(),
          expenseChart: expenseBase64,
          trendChart: trendBase64,
        },
        { responseType: "blob" },
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Annual_Summary_${year.year()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      //expenseChartRef.current.chart.options.plugins.tooltip.enabled = true;
      //trendChartRef.current.chart.options.plugins.tooltip.enabled = true;
      //expenseChartRef.current.chart.update();
      //trendChartRef.current.chart.update();
    }
  };
  let pieData = null;

  if (report) {
    pieData = [
      ...report.categoryTotals,
      {
        category: "Savings",
        amount: report.totalSavings,
        percentage: report.savingsRate,
      },
    ];
  }

  return (
    <>
      {isExporting && (
        <div style={loaderOverlayStyle}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }} fontSize={16} fontWeight={500}>
              Generating PDF… Please wait
            </Typography>
          </Box>
        </div>
      )}
      <Box>
        <Typography variant="h6" fontWeight={600}>
          Annual Report Summary
        </Typography>
        <Divider flexItem sx={{ mt: 1, mb: 1 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
          }}
        >
          <LeftAlignedLabel sx={{ mr: 1 }}>Year</LeftAlignedLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year"]}
              value={year}
              onChange={handleYearChange}
              slotProps={{
                textField: { size: "small", fullWidth: true },
              }}
            />
          </LocalizationProvider>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
            Select year to view to report
          </Typography>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Box>
            {loading && (
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <CircularProgress size={28} />
              </Box>
            )}

            {!loading && !report && hasTried && (
              <Typography fontSize={14} color="#6b7a86">
                No data available for this year.
              </Typography>
            )}

            {!loading && report && <AnnualInsightCard data={report} />}

            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid size={4.5}>
                {!loading && report && (
                  <div ref={expenseChartRef} style={{ pointerEvents: isExporting ? "none" : "auto" }}>
                    <AnnualExpenseChart
                      data={pieData}
                      totalIncome={report.totalIncome}
                      totalSavings={report.totalSavings}
                    />
                  </div>
                )}
              </Grid>
              <Grid size={7.5}>
                {!loading && report && (
                  <div ref={trendChartRef} style={{ pointerEvents: isExporting ? "none" : "auto" }}>
                    <MonthlyTrendChart data={report.monthlyTrend} />
                  </div>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
        {!loading && report && (
          <Button
            variant="contained"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            sx={{ mt: 1 }}
          >
            {isExporting ? "Preparing…" : "Download Annual Summary PDF"}
          </Button>
        )}
      </Box>
    </>
  );
}
