package com.myfinances.dto;

import java.math.BigDecimal;


public class AccountRequestDTO {
	
	private String accountName;
	
	private BigDecimal currentBalance;
	
	private String accountType;
	
	private String cardColor;

	public String getAccountName() {
		return accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}

	public BigDecimal getCurrentBalance() {
		return currentBalance;
	}

	public void setCurrentBalance(BigDecimal currentBalance) {
		this.currentBalance = currentBalance;
	}

	public String getAccountType() {
		return accountType;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	public String getCardColor() {
		return cardColor;
	}

	public void setCardColor(String cardColor) {
		this.cardColor = cardColor;
	}
	
}
