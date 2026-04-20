package com.myfinances.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.myfinances.entity.AccountTransaction;

public interface AccountTransactionRepository extends JpaRepository<AccountTransaction, Long> {

	void deleteByBudget_BudgetId(Long budgetId);

	void deleteByGoal_GoalId(Long goalId);

	List<AccountTransaction> findByAccount_AccountId(Long accountId);

    List<AccountTransaction> findByBudget_BudgetId(Long budgetId);

    @Query("""
    	    SELECT t FROM AccountTransaction t
    	    WHERE FUNCTION('YEAR', t.createdAt) = :year
    	      AND (
    	            :applyMonthFilter = false
    	            OR FUNCTION('MONTH', t.createdAt) IN :monthNumbers
    	          )
    	    ORDER BY t.createdAt DESC
    	""")
    	List<AccountTransaction> findByYearAndMonths(
    	        @Param("year") int year,
    	        @Param("applyMonthFilter") boolean applyMonthFilter,
    	        @Param("monthNumbers") List<Integer> monthNumbers
    	);
}
