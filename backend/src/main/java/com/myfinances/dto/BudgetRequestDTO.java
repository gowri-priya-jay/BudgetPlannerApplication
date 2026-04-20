package com.myfinances.dto;

import java.math.BigDecimal;
import java.util.List;

public class BudgetRequestDTO {
	
	private int month;
	
	private String monthName;
	
	private List<MonthlyExpenseDTO> monthlyExpenses;
	
	private List<MonthlyIncomeDTO> monthlyIncomes;
	
	private BigDecimal netActual;
	
	private BigDecimal netPlanned;
	
	private BigDecimal totalActualExpense;
	
	private BigDecimal totalActualIncome;
	
	private BigDecimal totalPlannedExpense;
	
	private BigDecimal totalPlannedIncome;
	
	private int year;
	
	private Long accountId;

	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	public String getMonthName() {
		return monthName;
	}

	public void setMonthName(String monthName) {
		this.monthName = monthName;
	}

	public List<MonthlyExpenseDTO> getMonthlyExpenses() {
		return monthlyExpenses;
	}

	public void setMonthlyExpenses(List<MonthlyExpenseDTO> monthlyExpenses) {
		this.monthlyExpenses = monthlyExpenses;
	}

	public List<MonthlyIncomeDTO> getMonthlyIncomes() {
		return monthlyIncomes;
	}

	public void setMonthlyIncomes(List<MonthlyIncomeDTO> monthlyIncomes) {
		this.monthlyIncomes = monthlyIncomes;
	}

	public BigDecimal getNetActual() {
		return netActual;
	}

	public void setNetActual(BigDecimal netActual) {
		this.netActual = netActual;
	}

	public BigDecimal getNetPlanned() {
		return netPlanned;
	}

	public void setNetPlanned(BigDecimal netPlanned) {
		this.netPlanned = netPlanned;
	}

	public BigDecimal getTotalActualExpense() {
		return totalActualExpense;
	}

	public void setTotalActualExpense(BigDecimal totalActualExpense) {
		this.totalActualExpense = totalActualExpense;
	}

	public BigDecimal getTotalActualIncome() {
		return totalActualIncome;
	}

	public void setTotalActualIncome(BigDecimal totalActualIncome) {
		this.totalActualIncome = totalActualIncome;
	}

	public BigDecimal getTotalPlannedExpense() {
		return totalPlannedExpense;
	}

	public void setTotalPlannedExpense(BigDecimal totalPlannedExpense) {
		this.totalPlannedExpense = totalPlannedExpense;
	}

	public BigDecimal getTotalPlannedIncome() {
		return totalPlannedIncome;
	}

	public void setTotalPlannedIncome(BigDecimal totalPlannedIncome) {
		this.totalPlannedIncome = totalPlannedIncome;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

}
