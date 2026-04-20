package com.myfinances.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myfinances.dto.AllocationItemRequestDTO;
import com.myfinances.dto.SavingAllocationRequestDTO;
import com.myfinances.entity.AccountTransaction;
import com.myfinances.entity.Account;
import com.myfinances.entity.Budget;
import com.myfinances.entity.ExternalTransfer;
import com.myfinances.entity.SavingGoal;
import com.myfinances.entity.SavingAllocation;
import com.myfinances.entity.TransactionType;
import com.myfinances.repo.AccountTransactionRepository;
import com.myfinances.repo.BudgetRepository;
import com.myfinances.repo.ExternalTransferRepository;
import com.myfinances.repo.SavingGoalRepository;
import com.myfinances.repo.SavingAllocationRepository;

import jakarta.transaction.Transactional;

@Service
public class AllocationServiceImpl implements AllocationService {

	@Autowired
	BudgetRepository budgetRepo;

	@Autowired
	SavingAllocationRepository allocationRepo;

	@Autowired
	ExternalTransferRepository externalTransfersRepo;
	
	@Autowired
	AccountTransactionRepository acctTransactionRepo;

	@Autowired
	SavingGoalRepository savingGoalsRepo;

	@Autowired
	GoalService goalService;

	@Autowired
	AccountService accountsService;

	@Override
	@Transactional
	public void allocateSavings(SavingAllocationRequestDTO requestDto) {

		Budget budget = budgetRepo.findById(requestDto.getBudgetId())
				.orElseThrow(() -> new IllegalArgumentException("Budget not found: " + requestDto.getBudgetId()));
		// 1. Reverse existing allocations (for reallocation)
		List<SavingAllocation> existing = allocationRepo.findByBudget_BudgetId(budget.getBudgetId());
		for (SavingAllocation alloc : existing) {
			SavingGoal goal = alloc.getGoal();
			goalService.decreaseSavedAmount(goal, alloc.getAllocatedAmount());
			//accountsService.decreaseBalance(account, alloc.getAllocatedAmount());
		}

		allocationRepo.deleteByBudget_BudgetId(budget.getBudgetId());
		externalTransfersRepo.deleteByBudget_BudgetId(budget.getBudgetId());
		acctTransactionRepo.deleteByBudget_BudgetId(budget.getBudgetId());
		// 2. Apply new allocations
		BigDecimal totalAllocated = BigDecimal.ZERO;

		for (AllocationItemRequestDTO item : requestDto.getAllocations()) {
			if (item.getAmount() == null || item.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
				continue;
			}
			SavingGoal goal = savingGoalsRepo.findById(item.getGoalId())
					.orElseThrow(() -> new IllegalArgumentException("Goal not found: " + item.getGoalId()));
			Account account = goal.getAccount(); // may be null
			boolean isExternal = goal.getIsExternal() || account == null;
            // Insert into savings_allocation
			SavingAllocation allocation = new SavingAllocation();
			allocation.setBudget(budget);
			allocation.setGoal(goal);
			allocation.setIsExternal(isExternal);
			allocation.setCreatedAt(LocalDateTime.now());
			allocationRepo.save(allocation);

			// Update goal
			goalService.increaseSavedAmount(goal, item.getAmount());

			// Update account or external transfer
			if(isExternal) {
				ExternalTransfer transfer = new ExternalTransfer();
				transfer.setBudget(budget);
				transfer.setGoal(goal);
				transfer.setAmount(item.getAmount());
				transfer.setCreatedAt(LocalDateTime.now());
				transfer.setNotes("Savings allocation");
				transfer.setCountry("India");
				externalTransfersRepo.save(transfer);
			} else {
                // Insert into account_transactions
                AccountTransaction txn = new AccountTransaction();
                txn.setAccount(account);
                txn.setBudget(budget);
                txn.setGoal(goal);
                txn.setAmount(item.getAmount());
                txn.setType(TransactionType.ALLOCATION);
                txn.setCreatedAt(LocalDateTime.now());
                acctTransactionRepo.save(txn);

                // Update account balance
                accountsService.increaseBalance(account, item.getAmount());
            }
			totalAllocated = totalAllocated.add(item.getAmount());
		}
	}

}
