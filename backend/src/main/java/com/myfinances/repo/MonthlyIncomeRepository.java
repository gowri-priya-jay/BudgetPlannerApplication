package com.myfinances.repo;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.myfinances.entity.MonthlyIncome;

public interface MonthlyIncomeRepository extends JpaRepository<MonthlyIncome, Long> {

	List<MonthlyIncome> findByBudget_BudgetId(Long budgetId);

	@Query("SELECT COALESCE(SUM(mi.actualIncome), 0) FROM MonthlyIncome mi WHERE mi.budget.budgetId = :budgetId")
	BigDecimal sumIncome(Long budgetId);

	Optional<MonthlyIncome> findByBudget_BudgetIdAndIncomeItem_IncomeId(Long budgetId, Long incomeId);

}
