package com.myfinances.dto;

import java.math.BigDecimal;

public class ExpenseRowDTO {
	
	private String month;
	
    private Long expenseId;
    
    private String category;
    
    private String item;
    
    private BigDecimal planned;
    
    private BigDecimal actual;

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public Long getExpenseId() {
		return expenseId;
	}

	public void setExpenseId(Long expenseId) {
		this.expenseId = expenseId;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getItem() {
		return item;
	}

	public void setItem(String item) {
		this.item = item;
	}

	public BigDecimal getPlanned() {
		return planned;
	}

	public void setPlanned(BigDecimal planned) {
		this.planned = planned;
	}

	public BigDecimal getActual() {
		return actual;
	}

	public void setActual(BigDecimal actual) {
		this.actual = actual;
	}

}
