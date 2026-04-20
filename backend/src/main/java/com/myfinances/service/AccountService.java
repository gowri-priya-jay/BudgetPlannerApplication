package com.myfinances.service;

import java.math.BigDecimal;
import java.util.List;

import com.myfinances.dto.AccountRequestDTO;
import com.myfinances.dto.AccountResponseDTO;
import com.myfinances.entity.Account;

public interface AccountService {

	AccountResponseDTO createAccount(AccountRequestDTO requestDto);
	
	List<AccountResponseDTO> getAllAccounts();

	AccountResponseDTO getAccountById(Long accountId);
	
	AccountResponseDTO updateAccount(Long accountId, AccountRequestDTO dto);
	
	AccountResponseDTO mapToResponse(Account account);

	void deleteAccount(Long accountId);
	
	void decreaseBalance(Account account, BigDecimal allocatedAmount);

	void increaseBalance(Account account, BigDecimal allocatedAmount);

	void addAmount(Long accountId, BigDecimal allocatedAmount);

}
