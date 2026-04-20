package com.myfinances.dto;

import java.math.BigDecimal;
import java.util.List;

public class BudgetResponseDTO {
	
	private Long budgetId;
	
    private String month;
    
    private Integer year;
    
    private AccountResponseDTO account;
    
    private BigDecimal totalIncome;
    
    private BigDecimal totalExpense;
    
    private BigDecimal totalPlannedIncome;
    
    private BigDecimal totalPlannedExpense;
    
    private BigDecimal actualSavings;
    
    private BigDecimal plannedSavings;
    
    private String allocationStatus;
    
    private BigDecimal allocatedAmount;
    
    private BigDecimal remainingSavings;

    private List<MonthlyIncomeDTO> incomes;
    
    private List<MonthlyExpenseDTO> expenses;

    private List<AllocationItemResponseDTO> allocations;

	public Long getBudgetId() {
		return budgetId;
	}

	public void setBudgetId(Long budgetId) {
		this.budgetId = budgetId;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
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

	public BigDecimal getActualSavings() {
		return actualSavings;
	}

	public void setActualSavings(BigDecimal actualSavings) {
		this.actualSavings = actualSavings;
	}

	public String getAllocationStatus() {
		return allocationStatus;
	}

	public void setAllocationStatus(String allocationStatus) {
		this.allocationStatus = allocationStatus;
	}

	public BigDecimal getAllocatedAmount() {
		return allocatedAmount;
	}

	public void setAllocatedAmount(BigDecimal allocatedAmount) {
		this.allocatedAmount = allocatedAmount;
	}

	public BigDecimal getRemainingSavings() {
		return remainingSavings;
	}

	public void setRemainingSavings(BigDecimal remainingSavings) {
		this.remainingSavings = remainingSavings;
	}
	
	public BigDecimal getTotalPlannedIncome() {
		return totalPlannedIncome;
	}

	public void setTotalPlannedIncome(BigDecimal totalPlannedIncome) {
		this.totalPlannedIncome = totalPlannedIncome;
	}

	public BigDecimal getTotalPlannedExpense() {
		return totalPlannedExpense;
	}

	public void setTotalPlannedExpense(BigDecimal totalPlannedExpense) {
		this.totalPlannedExpense = totalPlannedExpense;
	}

	public BigDecimal getPlannedSavings() {
		return plannedSavings;
	}

	public void setPlannedSavings(BigDecimal plannedSavings) {
		this.plannedSavings = plannedSavings;
	}

	public List<AllocationItemResponseDTO> getAllocations() {
		return allocations;
	}

	public void setAllocations(List<AllocationItemResponseDTO> allocations) {
		this.allocations = allocations;
	}

	public AccountResponseDTO getAccount() {
		return account;
	}

	public void setAccount(AccountResponseDTO account) {
		this.account = account;
	}

	public List<MonthlyIncomeDTO> getIncomes() {
		return incomes;
	}

	public void setIncomes(List<MonthlyIncomeDTO> incomes) {
		this.incomes = incomes;
	}

	public List<MonthlyExpenseDTO> getExpenses() {
		return expenses;
	}

	public void setExpenses(List<MonthlyExpenseDTO> expenses) {
		this.expenses = expenses;
	}
	
}
