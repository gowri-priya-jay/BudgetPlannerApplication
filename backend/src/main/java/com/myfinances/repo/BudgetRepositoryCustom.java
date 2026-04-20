package com.myfinances.repo;

import java.util.List;

import com.myfinances.entity.Budget;

public interface BudgetRepositoryCustom {

	List<Budget> findByFilters(Integer year, String month, Long expenseCategoryId, Long expenseItemId, Long goalId,
			String sortBy, String sortOrder);

}
