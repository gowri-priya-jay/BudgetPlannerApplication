package com.myfinances.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnnualReportResponseDTO {

	private int year;

	private BigDecimal totalIncome;
	private BigDecimal totalExpense;
	private BigDecimal totalSavings;
	private BigDecimal savingsRate;

	private String highestSpendingMonth;
	private String lowestSpendingMonth;

	private BigDecimal avgMonthlyIncome;
	private BigDecimal avgMonthlyExpense;
	private BigDecimal avgMonthlySavings;

	private int overspentMonths;
	private int underBudgetMonths;

	private List<AnnualExpenseCategoryResponseDTO> categoryTotals;
	private List<MonthlyTrendResponseDTO> monthlyTrend;

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public BigDecimal getTotalIncome() {
		return totalIncome;
	}

	public void setTotalIncome(BigDecimal totalIncome) {
		this.totalIncome = totalIncome;
	}

	public BigDecimal getTotalExpense() {
		return totalExpense;
	}

	public void setTotalExpense(BigDecimal totalExpense) {
		this.totalExpense = totalExpense;
	}

	public BigDecimal getTotalSavings() {
		return totalSavings;
	}

	public void setTotalSavings(BigDecimal totalSavings) {
		this.totalSavings = totalSavings;
	}

	public BigDecimal getSavingsRate() {
		return savingsRate;
	}

	public void setSavingsRate(BigDecimal savingsRate) {
		this.savingsRate = savingsRate;
	}

	public String getHighestSpendingMonth() {
		return highestSpendingMonth;
	}

	public void setHighestSpendingMonth(String highestSpendingMonth) {
		this.highestSpendingMonth = highestSpendingMonth;
	}

	public String getLowestSpendingMonth() {
		return lowestSpendingMonth;
	}

	public void setLowestSpendingMonth(String lowestSpendingMonth) {
		this.lowestSpendingMonth = lowestSpendingMonth;
	}

	public BigDecimal getAvgMonthlyIncome() {
		return avgMonthlyIncome;
	}

	public void setAvgMonthlyIncome(BigDecimal avgMonthlyIncome) {
		this.avgMonthlyIncome = avgMonthlyIncome;
	}

	public BigDecimal getAvgMonthlyExpense() {
		return avgMonthlyExpense;
	}

	public void setAvgMonthlyExpense(BigDecimal avgMonthlyExpense) {
		this.avgMonthlyExpense = avgMonthlyExpense;
	}

	public BigDecimal getAvgMonthlySavings() {
		return avgMonthlySavings;
	}

	public void setAvgMonthlySavings(BigDecimal avgMonthlySavings) {
		this.avgMonthlySavings = avgMonthlySavings;
	}

	public int getOverspentMonths() {
		return overspentMonths;
	}

	public void setOverspentMonths(int overspentMonths) {
		this.overspentMonths = overspentMonths;
	}

	public int getUnderBudgetMonths() {
		return underBudgetMonths;
	}

	public void setUnderBudgetMonths(int underBudgetMonths) {
		this.underBudgetMonths = underBudgetMonths;
	}

	public List<AnnualExpenseCategoryResponseDTO> getCategoryTotals() {
		return categoryTotals;
	}

	public void setCategoryTotals(List<AnnualExpenseCategoryResponseDTO> categoryTotals) {
		this.categoryTotals = categoryTotals;
	}

	public List<MonthlyTrendResponseDTO> getMonthlyTrend() {
		return monthlyTrend;
	}

	public void setMonthlyTrend(List<MonthlyTrendResponseDTO> monthlyTrend) {
		this.monthlyTrend = monthlyTrend;
	}

}
