package com.myfinances.dto;

import java.math.BigDecimal;

public class WithdrawAmountRequestDTO {
	
	private long goalId;
	
	private BigDecimal amount;
	
	private String notes;

	public long getGoalId() {
		return goalId;
	}

	public void setGoalId(long goalId) {
		this.goalId = goalId;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

}
