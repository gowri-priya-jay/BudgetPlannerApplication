package com.myfinances.dto;

import java.math.BigDecimal;

public class GoalAllocationResponseDTO {

	private String monthName;
	
	private String goalName;
	
	private BigDecimal allocatedAmount;

	public String getMonthName() {
		return monthName;
	}

	public void setMonthName(String monthName) {
		this.monthName = monthName;
	}

	public String getGoalName() {
		return goalName;
	}

	public void setGoalName(String goalName) {
		this.goalName = goalName;
	}

	public BigDecimal getAllocatedAmount() {
		return allocatedAmount;
	}

	public void setAllocatedAmount(BigDecimal allocatedAmount) {
		this.allocatedAmount = allocatedAmount;
	}
	
}
