package com.myfinances.controller;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.myfinances.dto.AccountRequestDTO;
import com.myfinances.dto.AccountResponseDTO;
import com.myfinances.service.AccountService;

@Controller
@RequestMapping("/account")
public class AccountController {

	private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

	@Autowired
	AccountService accountService;

	@PostMapping("/createAccount")
	public ResponseEntity<?> createAccount(@RequestBody AccountRequestDTO requestDto) throws IOException {
		logger.info("Creating new account");
		AccountResponseDTO responseDto = accountService.createAccount(requestDto);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/getAllAccounts")
	public ResponseEntity<List<AccountResponseDTO>> getAllAccounts() {
		return ResponseEntity.ok(accountService.getAllAccounts());
	}

	@GetMapping("/{accountId}")
	public ResponseEntity<AccountResponseDTO> getAccountById(@PathVariable Long accountId) {
		return ResponseEntity.ok(accountService.getAccountById(accountId));
	}

	@PutMapping("/{accountId}")
	public ResponseEntity<AccountResponseDTO> updateAccount(@PathVariable Long accountId,
			@RequestBody AccountRequestDTO dto) {
		return ResponseEntity.ok(accountService.updateAccount(accountId, dto));
	}

	@DeleteMapping("/{accountId}")
	public ResponseEntity<String> deleteAccount(@PathVariable Long accountId) {
		accountService.deleteAccount(accountId);
		return ResponseEntity.ok("Account deleted successfully");
	}

}
