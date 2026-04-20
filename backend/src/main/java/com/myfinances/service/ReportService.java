package com.myfinances.service;

import com.myfinances.dto.AnnualReportResponseDTO;
import com.myfinances.dto.AnnualSummaryReportDTO;
import com.myfinances.dto.FilterRequestDTO;
import com.myfinances.dto.BudgetReportResponseDTO;

public interface ReportService {

	AnnualReportResponseDTO getAnnualSummaryReport(int year);

	AnnualSummaryReportDTO buildAnnualSummary(int year);

	BudgetReportResponseDTO generateBudgetReport(FilterRequestDTO req);
	
}
