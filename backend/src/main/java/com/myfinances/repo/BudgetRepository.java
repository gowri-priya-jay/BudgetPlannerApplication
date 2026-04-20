package com.myfinances.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.myfinances.entity.Budget;

public interface BudgetRepository extends JpaRepository<Budget, Long>, BudgetRepositoryCustom  {

	boolean existsByMonthAndYearAndAccount_AccountId(String monthName, int year, Long accountId);
	
	@Query(""" 
			SELECT b FROM Budget b WHERE b.totalActualIncome > 0 OR b.totalActualExpense > 0 
			ORDER BY b.year DESC,
		      FIELD(b.month,
		        'January','February','March','April','May','June',
		        'July','August','September','October','November','December'
		      ) DESC
		""")
	List<Budget> findCompletedBudgets();

	List<Budget> findByYear(int year);

	@Query(value = """
		    SELECT * FROM budget 
		    WHERE year = :year
		    ORDER BY FIELD(month,
		        'January','February','March','April','May','June',
		        'July','August','September','October','November','December'
		    )
		""", nativeQuery = true)
	List<Budget> findByYearOrderByMonthAsc(@Param("year") int year);
	
	@Query("SELECT DISTINCT b.year FROM Budget b ORDER BY b.year DESC")
	List<Integer> findDistinctYears();
	
	@Query("SELECT COUNT(b) > 0 FROM Budget b WHERE b.totalActualIncome > 0 OR b.totalActualExpense > 0")
	boolean existsCompletedBudget();

	@Query("""
		    SELECT b FROM Budget b
		    WHERE b.year = :year
		    AND (:allMonths = true OR b.month IN :months)
		""")
		List<Budget> findBudgets(
		        @Param("year") int year,
		        @Param("months") List<String> months,
		        @Param("allMonths") boolean allMonths
		);
	
}
