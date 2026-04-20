package com.myfinances.dto;

import java.math.BigDecimal;

public class TransferGoalAmountRequestDTO {
	
	private long fromGoal;
	
	private long toGoal;
	
	private BigDecimal amount;

	public long getFromGoal() {
		return fromGoal;
	}

	public void setFromGoal(long fromGoal) {
		this.fromGoal = fromGoal;
	}

	public long getToGoal() {
		return toGoal;
	}

	public void setToGoal(long toGoal) {
		this.toGoal = toGoal;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	
}
