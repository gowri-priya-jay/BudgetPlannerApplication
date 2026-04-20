package com.myfinances.dto;

import java.math.BigDecimal;

public class BudgetCategoryBreakdownResponseDTO {

	private String categoryName;
	
	private BigDecimal total;

	public BudgetCategoryBreakdownResponseDTO(String categoryName, BigDecimal total) {
		this.categoryName = categoryName;
		this.total = total;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}
	
	

}
