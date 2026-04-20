package com.myfinances.service;

import java.util.List;

import com.myfinances.dto.AccountTransactionResponseDTO;
import com.myfinances.dto.ActivityResponseDTO;

public interface AccountTransactionService {

	List<AccountTransactionResponseDTO> getTransactionsByAccount(Long accountId);

	List<AccountTransactionResponseDTO> getTransactionsByBudget(Long budgetId);

	ActivityResponseDTO getActivity(int year, List<String> months);

}
