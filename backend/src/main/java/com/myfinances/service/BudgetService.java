package com.myfinances.service;

import java.util.List;

import com.myfinances.dto.BudgetCategoryBreakdownResponseDTO;
import com.myfinances.dto.BudgetRequestDTO;
import com.myfinances.dto.BudgetResponseDTO;
import com.myfinances.dto.BudgetUpdateRequestDTO;

public interface BudgetService {

	BudgetResponseDTO createBudget(BudgetRequestDTO budgetRequest);
	
	List<BudgetResponseDTO> getAllBudgets();
	
	BudgetResponseDTO getBudgetDetail(Long budgetId);

	BudgetResponseDTO updateBudget(BudgetUpdateRequestDTO req);

	void deleteBudget(Long budgetId);

	BudgetResponseDTO getLatestCompletedBudget();

	List<BudgetCategoryBreakdownResponseDTO> getBudgetBreakdown(Long budgetId);

	List<Integer> getBudgetedYear();

	boolean hasCompletedbudget();
	
}
