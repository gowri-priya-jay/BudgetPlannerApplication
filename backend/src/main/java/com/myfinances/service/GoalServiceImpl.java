package com.myfinances.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myfinances.dto.AllocationItemResponseDTO;
import com.myfinances.dto.FilterRequestDTO;
import com.myfinances.dto.GoalAllocationResponseDTO;
import com.myfinances.dto.GoalReportResponseDTO;
import com.myfinances.dto.SavingGoalRequestDTO;
import com.myfinances.dto.SavingGoalResponseDTO;
import com.myfinances.dto.TransferGoalAmountRequestDTO;
import com.myfinances.dto.WithdrawAmountRequestDTO;
import com.myfinances.entity.Account;
import com.myfinances.entity.AccountTransaction;
import com.myfinances.entity.Budget;
import com.myfinances.entity.ExternalTransfer;
import com.myfinances.entity.SavingGoal;
import com.myfinances.entity.TransactionType;
import com.myfinances.repo.AccountRepository;
import com.myfinances.repo.AccountTransactionRepository;
import com.myfinances.repo.BudgetRepository;
import com.myfinances.repo.ExternalTransferRepository;
import com.myfinances.repo.SavingGoalRepository;
import com.myfinances.util.Constants;

import jakarta.transaction.Transactional;

@Service
public class GoalServiceImpl implements GoalService {

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
	
	@Autowired
	BudgetRepository budgetRepo;
	
	@Autowired
	SavingAllocationService allocationService;

	public SavingGoalResponseDTO createGoal(SavingGoalRequestDTO dto) {
		// 1. Check existing goal
		if (goalRepo.existsByGoalName(dto.getGoalName())) {
			throw new RuntimeException(Constants.GOAL_DUPLICATE_MESSAGE);
		}
		// 2. Create new Goal
		SavingGoal goal = new SavingGoal();
		goal.setGoalName(dto.getGoalName());
		goal.setTargetAmount(dto.getTargetAmount());
		goal.setSavedAmount(BigDecimal.ZERO);
		goal.setIsExternal(dto.getIsExternal());
		goal.setCreatedAt(LocalDateTime.now());
		goal.setUpdatedAt(LocalDateTime.now());
		if (dto.getAccountId() != null) {
			Account account = accountRepo.findById(dto.getAccountId())
					.orElseThrow(() -> new RuntimeException(Constants.ACCOUNT_NOT_FOUND_MESSAGE));
			goal.setAccount(account);
		}
		SavingGoal saved = goalRepo.save(goal);
		return mapToResponse(saved);
	}

	@Override
	public List<SavingGoalResponseDTO> getAllGoals() {
		return goalRepo.findAll().stream().map(this::mapToResponse).toList();
	}
	
	@Override
	public SavingGoalResponseDTO getGoalByGoalId(Long goalId) {
		return mapToResponse(goalRepo.findById(goalId).get());
	}

	@Override
	public SavingGoalResponseDTO updateGoal(Long goalId, SavingGoalRequestDTO dto) {
		SavingGoal goal = goalRepo.findById(goalId)
				.orElseThrow(() -> new RuntimeException(Constants.GOAL_NOT_FOUND_MESSAGE));
		goal.setGoalName(dto.getGoalName());
		goal.setTargetAmount(dto.getTargetAmount());
		goal.setIsExternal(dto.getIsExternal());
		goal.setUpdatedAt(LocalDateTime.now());
		if (dto.getAccountId() != null) {
			Account account = accountRepo.findById(dto.getAccountId())
					.orElseThrow(() -> new RuntimeException(Constants.ACCOUNT_NOT_FOUND_MESSAGE));
			goal.setAccount(account);
		} else {
			goal.setAccount(null);
		}
		SavingGoal updated = goalRepo.save(goal);
		return mapToResponse(updated);
	}

	@Override
	public void deleteGoal(Long goalId) {
		if (!goalRepo.existsById(goalId)) {
			throw new RuntimeException(Constants.GOAL_NOT_FOUND_MESSAGE);
		}
		goalRepo.deleteById(goalId);
	}

	private SavingGoalResponseDTO mapToResponse(SavingGoal goal) {
		SavingGoalResponseDTO dto = new SavingGoalResponseDTO();
		dto.setGoalId(goal.getGoalId());
		dto.setGoalName(goal.getGoalName());
		dto.setTargetAmount(goal.getTargetAmount());
		dto.setSavedAmount(goal.getSavedAmount());
		dto.setIsExternal(goal.getIsExternal());
		if (goal.getAccount() != null) {
			dto.setAccountId(goal.getAccount().getAccountId());
			dto.setAccountName(goal.getAccount().getAccountName());
		}
		return dto;
	}

	@Override
	public void decreaseSavedAmount(SavingGoal goal, BigDecimal allocatedAmount) {
		BigDecimal current = goal.getSavedAmount() == null ? BigDecimal.ZERO : goal.getSavedAmount();
		goal.setSavedAmount(current.subtract(allocatedAmount));
		goalRepo.save(goal);
	}

	@Override
	public void increaseSavedAmount(SavingGoal goal, BigDecimal allocatedAmount) {
		BigDecimal current = goal.getSavedAmount() == null ? BigDecimal.ZERO : goal.getSavedAmount();
		goal.setSavedAmount(current.add(allocatedAmount));
		goalRepo.save(goal);
	}

	@Override
	@Transactional
	public void transferGoalAmount(TransferGoalAmountRequestDTO dto) {
		SavingGoal from = goalRepo.findById(dto.getFromGoal())
	            .orElseThrow(() -> new RuntimeException("Source goal not found"));

	    SavingGoal to = goalRepo.findById(dto.getToGoal())
	            .orElseThrow(() -> new RuntimeException("Destination goal not found"));

	    if (from.getIsExternal() == true) {
	        throw new RuntimeException("Cannot transfer from external goal");
	    }

	    if (from.getSavedAmount().compareTo(dto.getAmount()) < 0) {
	        throw new RuntimeException("Insufficient balance in source goal");
	    }

	    // Update saved amounts
	    from.setSavedAmount(from.getSavedAmount().subtract(dto.getAmount()));
	    from.setUpdatedAt(LocalDateTime.now());
	    to.setSavedAmount(to.getSavedAmount().add(dto.getAmount()));
	    to.setUpdatedAt(LocalDateTime.now());
	    goalRepo.save(from);
	    goalRepo.save(to);

	    //updating account balance
	    accountService.decreaseBalance(from.getAccount(), dto.getAmount());
	    if(to.getIsExternal()) {
	    	ExternalTransfer transfer = new ExternalTransfer();
	    	transfer.setGoal(to);
	    	transfer.setAmount(dto.getAmount());
	    	transfer.setCountry("India");
	    	transfer.setCreatedAt(LocalDateTime.now());
	    	transfer.setNotes("Amount has been transferred from "+from.getGoalName() +" goal to " + to.getGoalName());
	    	transferRepo.save(transfer);
	    }else {
	    	accountService.increaseBalance(to.getAccount(), dto.getAmount());
	    	// Credit entry
		    AccountTransaction credit = new AccountTransaction();
		    credit.setAccount(to.getAccount());
		    credit.setGoal(to);
		    credit.setAmount(dto.getAmount());
		    credit.setType(TransactionType.CREDIT);
		    credit.setCreatedAt(LocalDateTime.now());
		    transactionRepo.save(credit);
	    }
	    
	    // Debit entry
	    AccountTransaction debit = new AccountTransaction();
	    debit.setAccount(from.getAccount());
	    debit.setGoal(from);
	    debit.setAmount(dto.getAmount());
	    debit.setType(TransactionType.DEBIT);
	    debit.setCreatedAt(LocalDateTime.now());
	    transactionRepo.save(debit);
	}

	@Override
	public void withdrawGoalAmount(WithdrawAmountRequestDTO dto) {
		SavingGoal goal = goalRepo.findById(dto.getGoalId())
	            .orElseThrow(() -> new RuntimeException(Constants.GOAL_NOT_FOUND_MESSAGE));
		
		if (goal.getSavedAmount().compareTo(dto.getAmount()) < 0) {
	        throw new RuntimeException("Insufficient balance in goal");
	    }
		goal.setSavedAmount(goal.getSavedAmount().subtract(dto.getAmount()));
	    goal.setUpdatedAt(LocalDateTime.now());
		goalRepo.save(goal);
		Account account = goal.getAccount();
		account.setCurrentBalance(account.getCurrentBalance().subtract(dto.getAmount()));
		accountRepo.save(account);
		AccountTransaction withdraw = new AccountTransaction();
		withdraw.setGoal(goal);
		withdraw.setAmount(dto.getAmount());
		withdraw.setType(TransactionType.WITHDRAWAL);
		withdraw.setNotes(dto.getNotes());
		withdraw.setCreatedAt(LocalDateTime.now());
	    transactionRepo.save(withdraw);

	}

	@Override
	public GoalReportResponseDTO getAllocationReport(FilterRequestDTO req) {
		
		boolean allMonths = req.getMonths().contains("ALL");
		List<Budget> budgets = budgetRepo.findBudgets(
	            req.getYear(),
	            req.getMonths(),
	            allMonths
	    );
		GoalReportResponseDTO res = new GoalReportResponseDTO();
		List<GoalAllocationResponseDTO> goalList = new ArrayList<>();
		BigDecimal totalAllocatedAmount = new BigDecimal(0);
		for (Budget b : budgets) {
			List<AllocationItemResponseDTO>  allocationList = allocationService.getAllocationsForBudget(b.getBudgetId());
			for(AllocationItemResponseDTO allocation : allocationList) {
				GoalAllocationResponseDTO dto = new GoalAllocationResponseDTO();
				dto.setGoalName(allocation.getGoalName());
				dto.setMonthName(b.getMonth());
				dto.setAllocatedAmount(allocation.getAllocatedAmount());
				goalList.add(dto);
				totalAllocatedAmount = totalAllocatedAmount.add(allocation.getAllocatedAmount());	
			}	
		}
		res.setTotalAllocatedAmount(totalAllocatedAmount);
		res.setAllocationDetails(goalList);
		return res;
	}

}
