package com.myfinances.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myfinances.entity.ExternalTransfer;

public interface ExternalTransferRepository extends JpaRepository<ExternalTransfer, Long> {

	void deleteByBudget_BudgetId(Long budgetId);

	void deleteByGoal_GoalId(Long goalId);

    List<ExternalTransfer> findByBudget_BudgetId(Long budgetId);

    List<ExternalTransfer> findByGoal_GoalId(Long goalId);

}
