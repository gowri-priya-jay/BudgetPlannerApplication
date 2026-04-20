package com.myfinances.service;

import java.util.List;

import com.myfinances.dto.ExpenseCategoryResponseDTO;
import com.myfinances.dto.ExpenseItemResponseDTO;
import com.myfinances.dto.IncomeItemResponseDTO;

public interface MasterDataService {

	List<IncomeItemResponseDTO> getIncomeItems();

	List<ExpenseItemResponseDTO>  getExpenseItems();

	List<ExpenseCategoryResponseDTO> getExpenseCategories();
	
	ExpenseCategoryResponseDTO createExpenseCategory(String categoryName);

	ExpenseCategoryResponseDTO updateExpenseCategory(Long categoryId, String categoryName);

	void deleteExpenseCategory(Long categoryId);

	IncomeItemResponseDTO createIncomeItem(String incomeName);

	IncomeItemResponseDTO updateIncomeItem(Long incomeId, String incomeName);

	void deleteIncomeItem(Long incomeId);

	ExpenseItemResponseDTO createExpenseItem(String expenseName, Long categoryId);

	ExpenseItemResponseDTO updateExpenseItem(Long expenseId, String expenseName, Long categoryId);

	void deleteExpenseItem(Long expenseId);

	List<ExpenseItemResponseDTO> getItemsByCategory(Long categoryId);
	

}
