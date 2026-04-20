package com.myfinances.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.myfinances.dto.AnnualReportResponseDTO;
import com.myfinances.dto.AnnualSummaryPdfRequestDTO;
import com.myfinances.dto.AnnualSummaryReportDTO;
import com.myfinances.dto.FilterRequestDTO;
import com.myfinances.dto.BudgetReportResponseDTO;
import com.myfinances.service.ReportService;
import com.myfinances.util.AnnualSummaryPdfBuilder;

@Controller
@RequestMapping("/reports")
public class ReportController {

	@Autowired
	ReportService reportService;

	@GetMapping("/getAnnualSummary")
	@ResponseBody
	public AnnualReportResponseDTO getAnnualSummaryReport(@RequestParam int year) {
		return reportService.getAnnualSummaryReport(year);
	}

	@PostMapping(value = "/annual-summary/pdf", produces = "application/pdf")
	public ResponseEntity<byte[]> exportAnnualSummaryPdf(@RequestBody AnnualSummaryPdfRequestDTO req) {

		AnnualSummaryReportDTO dto = reportService.buildAnnualSummary(req.getYear());
		byte[] bytes = AnnualSummaryPdfBuilder.build(dto, req);

		String fileName = "ANNUAL_SUMMARY_" + req.getYear() + ".pdf";

		HttpHeaders headers = new HttpHeaders();
		headers.setContentDispositionFormData("attachment", fileName);
		headers.setContentType(MediaType.APPLICATION_PDF);

		return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
	}

	@PostMapping("/getBudgetReport")
	@ResponseBody
	public BudgetReportResponseDTO getBudgetReport(@RequestBody FilterRequestDTO req) {
		return reportService.generateBudgetReport(req);
	}

}
