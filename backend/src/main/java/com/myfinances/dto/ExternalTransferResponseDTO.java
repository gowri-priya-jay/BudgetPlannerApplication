package com.myfinances.dto;

import java.math.BigDecimal;

public class ExternalTransferResponseDTO {
	
	private Long transferId;

    private Long budgetId;
    
    private String month;
    
    private Integer year;

    private Long goalId;
    
    private String goalName;

    private BigDecimal amount;

	public Long getTransferId() {
		return transferId;
	}

	public void setTransferId(Long transferId) {
		this.transferId = transferId;
	}

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

	public Long getGoalId() {
		return goalId;
	}

	public void setGoalId(Long goalId) {
		this.goalId = goalId;
	}

	public String getGoalName() {
		return goalName;
	}

	public void setGoalName(String goalName) {
		this.goalName = goalName;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
  
}
