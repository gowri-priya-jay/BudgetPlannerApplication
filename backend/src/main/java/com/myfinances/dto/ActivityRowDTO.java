package com.myfinances.dto;

import java.math.BigDecimal;

public class ActivityRowDTO {

    private String date;
    
    private String type; 

    private String fromGoal;
    
    private String toGoal;
    
    private BigDecimal amount;
    
    private String notes;

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getFromGoal() {
		return fromGoal;
	}

	public void setFromGoal(String fromGoal) {
		this.fromGoal = fromGoal;
	}

	public String getToGoal() {
		return toGoal;
	}

	public void setToGoal(String toGoal) {
		this.toGoal = toGoal;
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
