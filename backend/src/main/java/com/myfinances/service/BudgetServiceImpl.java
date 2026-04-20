package com.myfinances.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myfinances.entity.MonthlyExpense;
import com.myfinances.entity.MonthlyIncome;
import com.myfinances.entity.SavingAllocation;
import com.myfinances.entity.SavingGoal;
import com.myfinances.dto.AllocationItemResponseDTO;
import com.myfinances.dto.BudgetCategoryBreakdownResponseDTO;
import com.myfinances.dto.BudgetRequestDTO;
import com.myfinances.dto.BudgetResponseDTO;
import com.myfinances.dto.BudgetUpdateRequestDTO;
import com.myfinances.dto.MonthlyExpenseDTO;
import com.myfinances.dto.MonthlyIncomeDTO;
import com.myfinances.entity.Account;
import com.myfinances.entity.Budget;
import com.myfinances.repo.ExpenseCategoryRepository;
import com.myfinances.repo.ExpenseItemRepository;
import com.myfinances.repo.ExternalTransferRepository;
import com.myfinances.repo.IncomeItemRepository;
import com.myfinances.repo.MonthlyExpenseRepository;
import com.myfinances.repo.MonthlyIncomeRepository;
import com.myfinances.repo.SavingAllocationRepository;
import com.myfinances.repo.SavingGoalRepository;
import com.myfinances.util.Constants;

import jakarta.transaction.Transactional;

import com.myfinances.repo.AccountRepository;
import com.myfinances.repo.BudgetRepository;

@Service
public class BudgetServiceImpl implements BudgetService {

	@Autowired
	BudgetRepository budgetRepo;

	@Autowired
	AccountRepository accountRepo;

	@Autowired
	SavingGoalRepository goalRepo;

	@Autowired
	ExpenseCategoryRepository expenseCategoryRepo;

	@Autowired
	IncomeItemRepository incomeItemRepo;

	@Autowired
	ExpenseItemRepository expenseItemRepo;

	@Autowired
	MonthlyIncomeRepository monthlyIncomeRepo;

	@Autowired
	MonthlyExpenseRepository monthlyExpenseRepo;

	@Autowired
	SavingAllocationRepository allocationRepo;

	@Autowired
	ExternalTransferRepository transferRepo;

	@Autowired
	SavingAllocationService allocationService;

	@Autowired
	AccountService accountService;

	@Override
	@Transactional
	public BudgetResponseDTO createBudget(BudgetRequestDTO dto) {

		if (budgetRepo.existsByMonthAndYearAndAccount_AccountId(dto.getMonthName(), dto.getYear(),
				dto.getAccountId())) {
			throw new RuntimeException(Constants.BUDGET_DUPLICATE_MESSAGE);
		}

		// 1. Create Budget
		Budget budget = new Budget();
		budget.setMonth(dto.getMonthName());
		budget.setYear(dto.getYear());
		Account account = accountRepo.findById(dto.getAccountId())
				.orElseThrow(() -> new RuntimeException(Constants.ACCOUNT_NOT_FOUND_MESSAGE));
		if (account != null)
			budget.setAccount(account);
		budget.setTotalActualExpense(dto.getTotalActualExpense());
		budget.setTotalActualIncome(dto.getTotalActualIncome());
		budget.setTotalPlannedExpense(dto.getTotalPlannedExpense());
		budget.setTotalPlannedIncome(dto.getTotalPlannedIncome());
		budget.setPlannedSavings(dto.getNetPlanned());
		budget.setActualSavings(dto.getNetActual());
		budget.setCreatedAt(LocalDateTime.now());
		budget.setUpdatedAt(LocalDateTime.now());
		Budget savedBudget = budgetRepo.save(budget);

		// 2. Save incomes
		for (MonthlyIncomeDTO incomeDTO : dto.getMonthlyIncomes()) {
			MonthlyIncome income = new MonthlyIncome();
			income.setBudget(savedBudget);
			income.setIncomeItem(incomeItemRepo.findById(incomeDTO.getIncomeId()).orElseThrow());
			income.setPlannedIncome(incomeDTO.getPlannedIncome());
			income.setActualIncome(incomeDTO.getActualIncome());
			income.setCreatedAt(LocalDateTime.now());
			income.setUpdatedAt(LocalDateTime.now());
			monthlyIncomeRepo.save(income);
		}
		// 3. Save expenses
		for (MonthlyExpenseDTO expenseDTO : dto.getMonthlyExpenses()) {
			MonthlyExpense expense = new MonthlyExpense();
			expense.setBudget(savedBudget);
			expense.setExpenseItem(expenseItemRepo.findById(expenseDTO.getExpenseId()).orElseThrow());
			expense.setPlannedExpense(expenseDTO.getPlannedExpense());
			expense.setActualExpense(expenseDTO.getActualExpense());
			expense.setCreatedAt(LocalDateTime.now());
			expense.setUpdatedAt(LocalDateTime.now());
			monthlyExpenseRepo.save(expense);
		}
		// 4. Apply account balance changes

		if (account != null) {
			account.setCurrentBalance(account.getCurrentBalance().add(dto.getNetActual()));
			account.setUpdatedAt(LocalDateTime.now());
		}
		accountRepo.save(account);

		return mapToListDTO(savedBudget);
	}

	@Override
	public BudgetResponseDTO getBudgetDetail(Long budgetId) {

		Budget budget = budgetRepo.findById(budgetId)
				.orElseThrow(() -> new RuntimeException(Constants.BUDGET_NOT_FOUND));
		return mapToListDTO(budget);
	}

	@Override
	public List<BudgetResponseDTO> getAllBudgets() {
		return budgetRepo.findAll().stream().map(this::mapToListDTO).toList();
	}

	@Override
	@Transactional
	public BudgetResponseDTO updateBudget(BudgetUpdateRequestDTO req) {
		Budget budget = budgetRepo.findById(req.getBudgetId())
				.orElseThrow(() -> new RuntimeException(Constants.BUDGET_NOT_FOUND));

		BigDecimal oldSavings = budget.getActualSavings();
		accountService.increaseBalance(budget.getAccount(), req.getNetActual().subtract(oldSavings));
		budget.setTotalPlannedIncome(req.getTotalPlannedIncome());
		budget.setTotalActualIncome(req.getTotalActualIncome());
		budget.setTotalPlannedExpense(req.getTotalPlannedExpense());
		budget.setTotalActualExpense(req.getTotalActualExpense());
		budget.setPlannedSavings(req.getNetPlanned());
		budget.setActualSavings(req.getNetActual());
		budget.setUpdatedAt(LocalDateTime.now());
		// ---------------- UPDATE MONTHLY INCOME ROWS ----------------
		for (MonthlyIncomeDTO dto : req.getMonthlyIncomes()) {

			MonthlyIncome income = monthlyIncomeRepo
					.findByBudget_BudgetIdAndIncomeItem_IncomeId(req.getBudgetId(), dto.getIncomeId())
					.orElseThrow(() -> new RuntimeException("Income row missing"));
			income.setPlannedIncome(dto.getPlannedIncome());
			income.setActualIncome(dto.getActualIncome());
			income.setUpdatedAt(LocalDateTime.now());
			monthlyIncomeRepo.save(income);
		}
		// ---------------- UPDATE MONTHLY EXPENSE ROWS ----------------
		for (MonthlyExpenseDTO dto : req.getMonthlyExpenses()) {
			MonthlyExpense expense = monthlyExpenseRepo
					.findByBudget_BudgetIdAndExpenseItem_ExpenseId(req.getBudgetId(), dto.getExpenseId())
					.orElseThrow(() -> new RuntimeException("Expense row missing"));

			expense.setPlannedExpense(dto.getPlannedExpense());
			expense.setActualExpense(dto.getActualExpense());
			expense.setUpdatedAt(LocalDateTime.now());
			monthlyExpenseRepo.save(expense);
		}
		budget = budgetRepo.save(budget);
		return mapToListDTO(budget);
	}

	@Override
	@Transactional
	public void deleteBudget(Long budgetId) {

		Budget budget = budgetRepo.findById(budgetId)
				.orElseThrow(() -> new RuntimeException(Constants.BUDGET_NOT_FOUND));
		Account budgetAccount = budget.getAccount();
		BigDecimal netSavings = budget.getActualSavings();
		// 1️⃣ Reverse savings credit
		budgetAccount.setCurrentBalance(budgetAccount.getCurrentBalance().subtract(netSavings));
		accountRepo.save(budgetAccount);
		List<SavingAllocation> allocationList = allocationRepo.findByBudget_BudgetId(budget.getBudgetId());
		// 2️⃣ Reverse allocations
		for (SavingAllocation a : allocationList) {
			SavingGoal goal = a.getGoal();
			goal.setSavedAmount(goal.getSavedAmount().subtract(a.getAllocatedAmount()));
			goal.setUpdatedAt(LocalDateTime.now());
			goalRepo.save(goal);
			if (!a.getIsExternal()) {
				Account goalAcc = a.getGoal().getAccount();
				goalAcc.setCurrentBalance(goalAcc.getCurrentBalance().subtract(a.getAllocatedAmount()));
				accountRepo.save(goalAcc);
			}
			budgetAccount.setCurrentBalance(budgetAccount.getCurrentBalance().add(a.getAllocatedAmount()));
			budgetAccount.setUpdatedAt(LocalDateTime.now());
			accountRepo.save(budgetAccount);
			allocationRepo.delete(a);
		}
		budgetRepo.delete(budget);
	}

	@Override
	public BudgetResponseDTO getLatestCompletedBudget() {
		List<Budget> budgets = budgetRepo.findCompletedBudgets();
		if (budgets == null || budgets.isEmpty()) {
	        return null;
	    }
		return mapToListDTO(budgets.get(0));
	}

	@Override
	public List<BudgetCategoryBreakdownResponseDTO> getBudgetBreakdown(Long budgetId) {
		return monthlyExpenseRepo.getCategoryTotals(budgetId);
	}

	private BudgetResponseDTO mapToListDTO(Budget budget) {
		BudgetResponseDTO dto = new BudgetResponseDTO();
		dto.setBudgetId(budget.getBudgetId());
		dto.setMonth(budget.getMonth());
		dto.setYear(budget.getYear());
		dto.setAccount(accountService.mapToResponse(budget.getAccount()));
		dto.setTotalIncome(budget.getTotalActualIncome());
		dto.setTotalExpense(budget.getTotalActualExpense());
		dto.setTotalPlannedIncome(budget.getTotalPlannedIncome());
		dto.setTotalPlannedExpense(budget.getTotalPlannedExpense());
		dto.setPlannedSavings(budget.getPlannedSavings());
		dto.setActualSavings(budget.getActualSavings());
		dto.setIncomes(
				monthlyIncomeRepo.findByBudget_BudgetId(budget.getBudgetId()).stream().map(this::mapIncome).toList());
		dto.setExpenses(
				monthlyExpenseRepo.findByBudget_BudgetId(budget.getBudgetId()).stream().map(this::mapExpense).toList());
		BigDecimal allocated = allocationRepo.sumAllocatedAmountByBudgetId(budget.getBudgetId());
		if (allocated == null || allocated.compareTo(BigDecimal.ZERO) == 0) {
			dto.setAllocationStatus("Not Allocated");
		} else if (allocated.compareTo(dto.getActualSavings()) != 0) {
			dto.setAllocationStatus("Needs Reallocation");
		} else {
			dto.setAllocationStatus("Allocated");
		}
		List<AllocationItemResponseDTO> allocationList = allocationService
				.getAllocationsForBudget(budget.getBudgetId());
		dto.setAllocations(allocationList);
		dto.setAllocatedAmount(allocated);
		dto.setRemainingSavings(budget.getActualSavings().subtract(allocated));
		return dto;
	}
	
	// ------------------ MAPPERS ------------------

	private MonthlyIncomeDTO mapIncome(MonthlyIncome income) {
		MonthlyIncomeDTO dto = new MonthlyIncomeDTO();
		dto.setIncomeId(income.getIncomeItem().getIncomeId());
		dto.setPlannedIncome(income.getPlannedIncome());
		dto.setActualIncome(income.getActualIncome());
		return dto;
	}

	private MonthlyExpenseDTO mapExpense(MonthlyExpense expense) {
		MonthlyExpenseDTO dto = new MonthlyExpenseDTO();
		dto.setExpenseId(expense.getExpenseItem().getExpenseId());
		dto.setPlannedExpense(expense.getPlannedExpense());
		dto.setActualExpense(expense.getActualExpense());
		return dto;
	}

	@Override
	public List<Integer> getBudgetedYear() {
		return budgetRepo.findDistinctYears();
	}

	@Override
	public boolean hasCompletedbudget() {
		return budgetRepo.existsCompletedBudget();
	}

}
