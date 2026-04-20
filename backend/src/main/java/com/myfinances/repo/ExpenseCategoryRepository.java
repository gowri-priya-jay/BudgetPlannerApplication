package com.myfinances.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myfinances.entity.ExpenseCategory;

public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Long> {
	
	boolean existsByCategoryNameIgnoreCase(String categoryName);

    boolean existsByCategoryNameIgnoreCaseAndCategoryIdNot(String categoryName, Long categoryId);

}
