package com.myfinances.repo;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.myfinances.entity.SavingAllocation;

public interface SavingAllocationRepository extends JpaRepository<SavingAllocation, Long> {

	List<SavingAllocation> findByBudget_BudgetId(Long budgetId);

	@Query("SELECT COALESCE(SUM(sa.allocatedAmount), 0) FROM SavingAllocation sa WHERE sa.budget.budgetId = :budgetId")
	BigDecimal sumAllocatedAmountByBudgetId(Long budgetId);

	void deleteByBudget_BudgetId(Long budgetId);

}
