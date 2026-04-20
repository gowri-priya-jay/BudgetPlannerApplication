package com.myfinances.dto;

import java.math.BigDecimal;

public class MonthlyExpenseDTO {

	private Long expenseId;
	
	private BigDecimal actualExpense;
	
	private BigDecimal plannedExpense;
	
	public Long getExpenseId() {
		return expenseId;
	}
	
	public void setExpenseId(Long expenseId) {
		this.expenseId = expenseId;
	}
	
	public BigDecimal getActualExpense() {
		return actualExpense;
	}
	
	public void setActualExpense(BigDecimal actualExpense) {
		this.actualExpense = actualExpense;
	}
	
	public BigDecimal getPlannedExpense() {
		return plannedExpense;
	}
	
	public void setPlannedExpense(BigDecimal plannedExpense) {
		this.plannedExpense = plannedExpense;
	}
	
}
