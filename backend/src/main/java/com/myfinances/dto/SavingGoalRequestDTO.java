package com.myfinances.dto;

import java.math.BigDecimal;

public class SavingGoalRequestDTO {
	
	private String goalName;
	
    private BigDecimal targetAmount;
    
    private Boolean isExternal;
    
    private Long accountId;

	public String getGoalName() {
		return goalName;
	}

	public void setGoalName(String goalName) {
		this.goalName = goalName;
	}

	public BigDecimal getTargetAmount() {
		return targetAmount;
	}

	public void setTargetAmount(BigDecimal targetAmount) {
		this.targetAmount = targetAmount;
	}

	public Boolean getIsExternal() {
		return isExternal;
	}

	public void setIsExternal(Boolean isExternal) {
		this.isExternal = isExternal;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}
    
}
