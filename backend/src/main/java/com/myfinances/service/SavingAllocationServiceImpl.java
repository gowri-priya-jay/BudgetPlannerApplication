package com.myfinances.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myfinances.dto.AllocationItemRequestDTO;
import com.myfinances.dto.AllocationItemResponseDTO;
import com.myfinances.dto.SavingAllocationRequestDTO;
import com.myfinances.dto.SavingAllocationResponseDTO;
import com.myfinances.entity.Account;
import com.myfinances.entity.AccountTransaction;
import com.myfinances.entity.Budget;
import com.myfinances.entity.ExternalTransfer;
import com.myfinances.entity.SavingAllocation;
import com.myfinances.entity.SavingGoal;
import com.myfinances.entity.TransactionType;
import com.myfinances.repo.AccountRepository;
import com.myfinances.repo.AccountTransactionRepository;
import com.myfinances.repo.BudgetRepository;
import com.myfinances.repo.ExternalTransferRepository;
import com.myfinances.repo.SavingAllocationRepository;
import com.myfinances.repo.SavingGoalRepository;
import com.myfinances.util.Constants;

import jakarta.transaction.Transactional;

@Service
public class SavingAllocationServiceImpl implements SavingAllocationService {

	@Autowired
	BudgetRepository budgetRepo;

	@Autowired
	SavingAllocationRepository allocationRepo;

	@Autowired
	SavingGoalRepository goalRepo;

	@Autowired
	AccountRepository accountRepo;

	@Autowired
	ExternalTransferRepository transferRepo;
	
	@Autowired
	AccountTransactionRepository transactionRepo;
	
	@Autowired
	AccountService accountService;

	@Transactional
	public SavingAllocationResponseDTO saveAllocations(SavingAllocationRequestDTO dto) {

		Budget budget = budgetRepo.findById(dto.getBudgetId())
				.orElseThrow(() -> new RuntimeException(Constants.BUDGET_NOT_FOUND));
		
		Account account = budget.getAccount();
		// 1. Delete old allocations (reallocation)
		List<SavingAllocation> oldAllocations = allocationRepo.findByBudget_BudgetId(dto.getBudgetId());
		for (SavingAllocation old : oldAllocations) {
			SavingGoal goal = old.getGoal();
			BigDecimal amount = old.getAllocatedAmount();

            // Reverse Goal savedAmount
            goal.setSavedAmount(goal.getSavedAmount().subtract(amount));
            goalRepo.save(goal);

			if (!goal.getIsExternal()) {
				accountService.increaseBalance(budget.getAccount(),old.getAllocatedAmount());
				accountService.decreaseBalance(goal.getAccount(), old.getAllocatedAmount());
			}
			if (goal.getIsExternal()) {
				accountService.increaseBalance(budget.getAccount(),old.getAllocatedAmount());
				transferRepo.deleteByBudget_BudgetId(dto.getBudgetId());
			}
			transactionRepo.deleteByBudget_BudgetId(dto.getBudgetId());
		}
		allocationRepo.deleteByBudget_BudgetId(dto.getBudgetId());

		// 2. Apply new allocations
		List<SavingAllocation> newAllocations = new ArrayList<>();

		for (AllocationItemRequestDTO item : dto.getAllocations()) {

			SavingGoal goal = goalRepo.findById(item.getGoalId())
					.orElseThrow(() -> new RuntimeException(Constants.GOAL_NOT_FOUND_MESSAGE));
			SavingAllocation allocation = new SavingAllocation();
			allocation.setBudget(budget);
			allocation.setGoal(goal);
			allocation.setAllocatedAmount(item.getAmount());
			allocation.setIsExternal(goal.getIsExternal());
			allocation.setCreatedAt(LocalDateTime.now());
			// INTERNAL GOAL → update account + create transaction
			if (!goal.getIsExternal()) {
				accountService.decreaseBalance(budget.getAccount(), item.getAmount());
                accountService.increaseBalance(goal.getAccount(), item.getAmount());
				AccountTransaction tx = new AccountTransaction();
				tx.setAccount(account);
				tx.setBudget(budget);
				tx.setGoal(goal);
				tx.setAmount(item.getAmount());
				tx.setType(TransactionType.ALLOCATION);
				tx.setCreatedAt(LocalDateTime.now());
				transactionRepo.save(tx);
			}
			// EXTERNAL GOAL → create external transfer
			if (goal.getIsExternal()) {
				accountService.decreaseBalance(budget.getAccount(), item.getAmount());
				ExternalTransfer transfer = new ExternalTransfer();
				transfer.setGoal(goal);
				transfer.setBudget(budget);
				transfer.setAmount(item.getAmount());
				transfer.setCountry("India");
				transfer.setNotes("Loan");
				transfer.setCreatedAt(LocalDateTime.now());
				transferRepo.save(transfer);
			}
			// Update savedAmount in goal
			goal.setSavedAmount(goal.getSavedAmount().add(item.getAmount()));
			goalRepo.save(goal);
			newAllocations.add(allocationRepo.save(allocation));
		}
		return buildResponse(dto.getBudgetId(), newAllocations);
	}

	private SavingAllocationResponseDTO buildResponse(Long budgetId, List<SavingAllocation> allocations) {

		SavingAllocationResponseDTO dto = new SavingAllocationResponseDTO();
		dto.setBudgetId(budgetId);
		BigDecimal total = allocations.stream().map(SavingAllocation::getAllocatedAmount).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		dto.setTotalAllocated(total);

		dto.setAllocations(allocations.stream().map(this::mapToResponse).toList());

		return dto;
	}

	private AllocationItemResponseDTO mapToResponse(SavingAllocation allocation) {

		AllocationItemResponseDTO dto = new AllocationItemResponseDTO();

		dto.setAllocationId(allocation.getAllocationId());
		dto.setBudgetId(allocation.getBudget().getBudgetId());
		dto.setGoalId(allocation.getGoal().getGoalId());
		dto.setGoalName(allocation.getGoal().getGoalName());
		dto.setAllocatedAmount(allocation.getAllocatedAmount());
		dto.setIsExternal(allocation.getIsExternal());
		if (!allocation.getIsExternal()) {
			Account account = allocation.getGoal().getAccount();
			dto.setAccountId(account.getAccountId());
			dto.setAccountName(account.getAccountName());
		}
		return dto;
	}

	@Override
	public List<AllocationItemResponseDTO> getAllocationsForBudget(Long budgetId) {
		return allocationRepo.findByBudget_BudgetId(budgetId).stream().map(this::mapToResponse).toList();
	}

}
