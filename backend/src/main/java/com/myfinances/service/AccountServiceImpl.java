package com.myfinances.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myfinances.dto.AccountRequestDTO;
import com.myfinances.dto.AccountResponseDTO;
import com.myfinances.entity.Account;
import com.myfinances.repo.AccountRepository;

@Service
public class AccountServiceImpl implements AccountService {

	private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);

	@Autowired
	AccountRepository accountRepo;

	@Override
	public AccountResponseDTO createAccount(AccountRequestDTO requestDto) {
		// Checking existing account name
		if (accountRepo.existsByAccountName(requestDto.getAccountName())) {
			throw new RuntimeException("Account name already exists");
		}
		// mapping to entity and saving
		Account account = new Account();
		account.setAccountName(requestDto.getAccountName());
		account.setAccountType(requestDto.getAccountType());
		account.setCurrentBalance(requestDto.getCurrentBalance());
		account.setCardColor(requestDto.getCardColor());
		account.setCreatedAt(LocalDateTime.now());
		account.setUpdatedAt(LocalDateTime.now());
		Account saved = accountRepo.save(account);
		logger.info(account.getAccountName() + " account has been created Successfully with Id = "
				+ account.getAccountId());
		return mapToResponse(saved);
	}

	@Override
	public List<AccountResponseDTO> getAllAccounts() {
		return accountRepo.findAll().stream().map(this::mapToResponse).toList();
	}

	@Override
	public AccountResponseDTO getAccountById(Long accountId) {
        Account account = accountRepo.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return mapToResponse(account);
    }

	@Override
    public AccountResponseDTO updateAccount(Long id, AccountRequestDTO dto) {
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setAccountName(dto.getAccountName());
        account.setAccountType(dto.getAccountType());
        account.setCurrentBalance(dto.getCurrentBalance());
        account.setCardColor(dto.getCardColor());
        account.setUpdatedAt(LocalDateTime.now());
        Account updated = accountRepo.save(account);
        logger.info(updated.getAccountName()+ " account has been updated");
        return mapToResponse(updated);
    }

	@Override
    public void deleteAccount(Long accountId) {
        if (!accountRepo.existsById(accountId)) {
            throw new RuntimeException("Account not found");
        }
        accountRepo.deleteById(accountId);
        logger.info(accountId + " account has been deleted");
    }

	@Override
	public void decreaseBalance(Account account, BigDecimal allocatedAmount) {
		if (account == null)
			return;
		BigDecimal current = account.getCurrentBalance() == null ? BigDecimal.ZERO : account.getCurrentBalance();
		account.setCurrentBalance(current.subtract(allocatedAmount));
		accountRepo.save(account);
	}

	@Override
	public void increaseBalance(Account account, BigDecimal allocatedAmount) {
		if (account == null)
			return;
		BigDecimal current = account.getCurrentBalance() == null ? BigDecimal.ZERO : account.getCurrentBalance();
		account.setCurrentBalance(current.add(allocatedAmount));
		accountRepo.save(account);
	}

	@Override
	public AccountResponseDTO mapToResponse(Account account) {
		AccountResponseDTO dto = new AccountResponseDTO();
		dto.setAccountId(account.getAccountId());
		dto.setAccountName(account.getAccountName());
		dto.setAccountType(account.getAccountType());
		dto.setCurrentBalance(account.getCurrentBalance());
		dto.setCardColor(account.getCardColor());
		return dto;
	}

	@Override
	public void addAmount(Long accountId, BigDecimal allocatedAmount) {
		// TODO Auto-generated method stub
		
	}

}
