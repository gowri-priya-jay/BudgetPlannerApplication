package com.myfinances.dto;

import java.util.List;

public class BudgetReportResponseDTO {

	private List<IncomeRowDTO> incomeRows;
	
    private List<ExpenseRowDTO> expenseRows;
    
    private List<SavingsRowDTO> savingsRows;

	public BudgetReportResponseDTO(List<IncomeRowDTO> incomeRows, List<ExpenseRowDTO> expenseRows,
			List<SavingsRowDTO> savingsRows) {
		this.incomeRows = incomeRows;
		this.expenseRows = expenseRows;
		this.savingsRows = savingsRows;
	}

	public List<IncomeRowDTO> getIncomeRows() {
		return incomeRows;
	}

	public void setIncomeRows(List<IncomeRowDTO> incomeRows) {
		this.incomeRows = incomeRows;
	}

	public List<ExpenseRowDTO> getExpenseRows() {
		return expenseRows;
	}

	public void setExpenseRows(List<ExpenseRowDTO> expenseRows) {
		this.expenseRows = expenseRows;
	}

	public List<SavingsRowDTO> getSavingsRows() {
		return savingsRows;
	}

	public void setSavingsRows(List<SavingsRowDTO> savingsRows) {
		this.savingsRows = savingsRows;
	}
    
}
