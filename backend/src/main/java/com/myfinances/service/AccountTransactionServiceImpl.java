package com.myfinances.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myfinances.dto.AccountTransactionResponseDTO;
import com.myfinances.dto.ActivityResponseDTO;
import com.myfinances.dto.ActivityRowDTO;
import com.myfinances.entity.AccountTransaction;
import com.myfinances.entity.TransactionType;
import com.myfinances.repo.AccountTransactionRepository;

@Service
public class AccountTransactionServiceImpl implements AccountTransactionService {

	@Autowired
	AccountTransactionRepository transactionRepo;

	@Override
	public List<AccountTransactionResponseDTO> getTransactionsByAccount(Long accountId) {
		return transactionRepo.findByAccount_AccountId(accountId).stream().map(this::mapToDTO).toList();
	}

	@Override
	public List<AccountTransactionResponseDTO> getTransactionsByBudget(Long budgetId) {
		return transactionRepo.findByBudget_BudgetId(budgetId).stream().map(this::mapToDTO).toList();
	}

	private AccountTransactionResponseDTO mapToDTO(AccountTransaction tx) {
		AccountTransactionResponseDTO dto = new AccountTransactionResponseDTO();
		dto.setTransactionId(tx.getTransactionId());
		dto.setAmount(tx.getAmount());
		dto.setType(tx.getType());
		dto.setAccountId(tx.getAccount().getAccountId());
		dto.setAccountName(tx.getAccount().getAccountName());
		dto.setBudgetId(tx.getBudget().getBudgetId());
		dto.setMonth(tx.getBudget().getMonth());
		dto.setYear(tx.getBudget().getYear());
		if (tx.getGoal() != null) {
			dto.setGoalId(tx.getGoal().getGoalId());
			dto.setGoalName(tx.getGoal().getGoalName());
		}
		return dto;
	}

	private static final Map<String, Integer> MONTH_MAP = Map.ofEntries(Map.entry("January", 1),
			Map.entry("February", 2), Map.entry("March", 3), Map.entry("April", 4), Map.entry("May", 5),
			Map.entry("June", 6), Map.entry("July", 7), Map.entry("August", 8), Map.entry("September", 9),
			Map.entry("October", 10), Map.entry("November", 11), Map.entry("December", 12));

	@Override
	public ActivityResponseDTO getActivity(int year, List<String> months) {
		boolean applyMonthFilter = true;
		List<Integer> monthNumbers = List.of();

		if (months == null || months.isEmpty() || months.contains("ALL")) {
			applyMonthFilter = false;
		} else {
			monthNumbers = months.stream().map(MONTH_MAP::get).toList();
		}

		List<AccountTransaction> txList = transactionRepo.findByYearAndMonths(year, applyMonthFilter, monthNumbers);

		List<ActivityRowDTO> rows = buildRows(txList);

		ActivityResponseDTO dto = new ActivityResponseDTO();
		dto.setRows(rows);
		return dto;
	}

	private List<ActivityRowDTO> buildRows(List<AccountTransaction> txList) {
		List<ActivityRowDTO> rows = new ArrayList<>();
		Map<String, List<AccountTransaction>> grouped = txList.stream().collect(Collectors
				.groupingBy(t -> t.getCreatedAt().toString() + "|" + (t.getNotes() == null ? "" : t.getNotes())));

		for (var entry : grouped.entrySet()) {
			List<AccountTransaction> group = entry.getValue();

			// Case 1: TRANSFER (CREDIT + DEBIT)
			if (group.size() == 2 && containsTransfer(group)) {
				rows.add(buildTransferRow(group));
			}

			// Case 2: WITHDRAWAL (single row)
			else {
				for (AccountTransaction t : group) {
					if (t.getType() == TransactionType.WITHDRAWAL) {
						rows.add(buildWithdrawalRow(t));
					}
				}
			}
		}

		return rows;
	}

	private boolean containsTransfer(List<AccountTransaction> group) {
		return group.stream().anyMatch(t -> t.getType() == TransactionType.CREDIT)
				&& group.stream().anyMatch(t -> t.getType() == TransactionType.DEBIT);
	}

	private ActivityRowDTO buildTransferRow(List<AccountTransaction> group) {
		AccountTransaction credit = group.stream().filter(t -> t.getType() == TransactionType.CREDIT).findFirst()
				.orElse(null);
		AccountTransaction debit = group.stream().filter(t -> t.getType() == TransactionType.DEBIT).findFirst()
				.orElse(null);
		ActivityRowDTO dto = new ActivityRowDTO();
		dto.setDate(credit.getCreatedAt().toLocalDate().toString());
		dto.setType("TRANSFER");
		dto.setAmount(credit.getAmount());
		dto.setNotes(credit.getNotes());
		dto.setFromGoal(debit.getGoal().getGoalName());
		dto.setToGoal(credit.getGoal().getGoalName());
		return dto;
	}

	private ActivityRowDTO buildWithdrawalRow(AccountTransaction t) {
		ActivityRowDTO dto = new ActivityRowDTO();
		dto.setDate(t.getCreatedAt().toLocalDate().toString());
		dto.setType("WITHDRAWAL");
		dto.setAmount(t.getAmount());
		dto.setNotes(t.getNotes());
		dto.setFromGoal(t.getGoal().getGoalName());
		dto.setToGoal(null);
		return dto;
	}

}
