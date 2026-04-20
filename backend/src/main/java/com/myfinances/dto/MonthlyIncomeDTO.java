package com.myfinances.dto;

import java.math.BigDecimal;

public class MonthlyIncomeDTO {
	
	private Long incomeId;
	
	private BigDecimal actualIncome;
	
	private BigDecimal plannedIncome;

	public Long getIncomeId() {
		return incomeId;
	}

	public void setIncomeId(Long incomeId) {
		this.incomeId = incomeId;
	}

	public BigDecimal getActualIncome() {
		return actualIncome;
	}

	public void setActualIncome(BigDecimal actualIncome) {
		this.actualIncome = actualIncome;
	}

	public BigDecimal getPlannedIncome() {
		return plannedIncome;
	}

	public void setPlannedIncome(BigDecimal plannedIncome) {
		this.plannedIncome = plannedIncome;
	}

}
