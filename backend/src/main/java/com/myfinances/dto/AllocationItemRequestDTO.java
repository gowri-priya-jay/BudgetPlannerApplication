package com.myfinances.dto;

import java.math.BigDecimal;

public class AllocationItemRequestDTO {
	
	private Long goalId;
	
	private BigDecimal amount;

	public Long getGoalId() {
		return goalId;
	}

	public void setGoalId(Long goalId) {
		this.goalId = goalId;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	
}
