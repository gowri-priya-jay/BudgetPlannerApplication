package com.myfinances.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myfinances.entity.ExpenseItem;

public interface ExpenseItemRepository extends JpaRepository<ExpenseItem, Long> {

	boolean existsByExpenseNameIgnoreCase(String expenseName);

	boolean existsByExpenseNameIgnoreCaseAndExpenseIdNot(String expenseName, Long expenseId);

	List<ExpenseItem> findByCategory_CategoryId(Long categoryId);

}
