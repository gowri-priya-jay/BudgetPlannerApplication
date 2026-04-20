package com.myfinances.dto;

import java.math.BigDecimal;

public class AccountResponseDTO {
	
	private Long accountId;
	
    private String accountName;
    
    private String accountType;
    
    private BigDecimal currentBalance;
    
    private String cardColor;

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

	public String getAccountName() {
		return accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}

	public String getAccountType() {
		return accountType;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	public BigDecimal getCurrentBalance() {
		return currentBalance;
	}

	public void setCurrentBalance(BigDecimal currentBalance) {
		this.currentBalance = currentBalance;
	}

	public String getCardColor() {
		return cardColor;
	}

	public void setCardColor(String cardColor) {
		this.cardColor = cardColor;
	}

}
