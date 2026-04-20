package com.myfinances.dto;

import java.math.BigDecimal;

public class IncomeRowDTO {
	
	private String month;
	
    private Long incomeId;
    
    private String incomeName;
    
    private BigDecimal planned;
    
    private BigDecimal actual;

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public Long getIncomeId() {
		return incomeId;
	}

	public void setIncomeId(Long incomeId) {
		this.incomeId = incomeId;
	}

	public String getIncomeName() {
		return incomeName;
	}

	public void setIncomeName(String incomeName) {
		this.incomeName = incomeName;
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
