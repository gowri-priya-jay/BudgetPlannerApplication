package com.myfinances.dto;

public class ReportFilterRequestDTO {
	
	private Integer year;
	
    private String month;    
    
    private String expenseCategory;
    
    private String expenseItem;
    
    private String incomeItem;
    
    private String goalId;     
    
    private String sortBy;      
    
    private String sortOrder;

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public String getExpenseCategory() {
		return expenseCategory;
	}

	public void setExpenseCategory(String expenseCategory) {
		this.expenseCategory = expenseCategory;
	}

	public String getExpenseItem() {
		return expenseItem;
	}

	public void setExpenseItem(String expenseItem) {
		this.expenseItem = expenseItem;
	}

	public String getIncomeItem() {
		return incomeItem;
	}

	public void setIncomeItem(String incomeItem) {
		this.incomeItem = incomeItem;
	}

	public String getGoalId() {
		return goalId;
	}

	public void setGoalId(String goalId) {
		this.goalId = goalId;
	}

	public String getSortBy() {
		return sortBy;
	}

	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}

	public String getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(String sortOrder) {
		this.sortOrder = sortOrder;
	} 
    
    

}
