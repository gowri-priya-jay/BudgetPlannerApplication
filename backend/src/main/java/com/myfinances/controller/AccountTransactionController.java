package com.myfinances.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.myfinances.dto.AccountTransactionResponseDTO;
import com.myfinances.dto.ActivityResponseDTO;
import com.myfinances.dto.FilterRequestDTO;
import com.myfinances.service.AccountTransactionService;

@Controller
@RequestMapping("/transactions")
public class AccountTransactionController {

	
	@Autowired
    private AccountTransactionService transactionService;

    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<List<AccountTransactionResponseDTO>> getTransactionsByAccount(
            @PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getTransactionsByAccount(accountId));
    }

    @GetMapping("/budgets/{budgetId}")
    public ResponseEntity<List<AccountTransactionResponseDTO>> getTransactionsByBudget(
            @PathVariable Long budgetId) {
        return ResponseEntity.ok(transactionService.getTransactionsByBudget(budgetId));
    }
    
    @PostMapping("/activity")
    public ResponseEntity<ActivityResponseDTO> getActivity(@RequestBody FilterRequestDTO req ) {
    	ActivityResponseDTO response = transactionService.getActivity(
                req.getYear(),
                req.getMonths()
        );

        return ResponseEntity.ok(response);
    }

}
