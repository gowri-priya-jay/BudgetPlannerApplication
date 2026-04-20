package com.myfinances.repo;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.myfinances.dto.BudgetCategoryBreakdownResponseDTO;
import com.myfinances.entity.MonthlyExpense;

public interface MonthlyExpenseRepository extends JpaRepository<MonthlyExpense, Long> {

	List<MonthlyExpense> findByBudget_BudgetId(Long budgetId);

	@Query("SELECT COALESCE(SUM(me.actualExpense), 0) FROM MonthlyExpense me WHERE me.budget.budgetId = :budgetId")
	BigDecimal sumExpense(Long budgetId);

	Optional<MonthlyExpense> findByBudget_BudgetIdAndExpenseItem_ExpenseId(Long budgetId, Long expenseId);

	@Query("""
		    SELECT new com.myfinances.dto.BudgetCategoryBreakdownResponseDTO(c.categoryName,SUM(me.actualExpense) )
		    FROM MonthlyExpense me
		    JOIN ExpenseItem ei ON me.expenseItem.expenseId = ei.expenseId
		    JOIN ExpenseCategory c ON ei.category.categoryId = c.categoryId
		    WHERE me.budget.budgetId = :budgetId
		    GROUP BY c.categoryId, c.categoryName
		""")
	List<BudgetCategoryBreakdownResponseDTO> getCategoryTotals(Long budgetId);

	List<MonthlyExpense> findByBudget_BudgetIdIn(List<Long> budgetIds);
	
	@Query("""
	        select me, ei, ec
	        from MonthlyExpense me
	        join me.expenseItem ei
	        join ei.category ec
	        join me.budget b
	        where b.year = :year
	    """)
	    List<Object[]> findCategoryBreakdownByYear(int year);

}
