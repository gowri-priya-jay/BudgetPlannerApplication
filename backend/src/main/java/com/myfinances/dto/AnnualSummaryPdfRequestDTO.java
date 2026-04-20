package com.myfinances.dto;

public class AnnualSummaryPdfRequestDTO {
	
	private int year;
	
    private String expenseChart; 

    private String trendChart;

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public String getExpenseChart() {
		return expenseChart;
	}

	public void setExpenseChart(String expenseChart) {
		this.expenseChart = expenseChart;
	}

	public String getTrendChart() {
		return trendChart;
	}

	public void setTrendChart(String trendChart) {
		this.trendChart = trendChart;
	}   

}
