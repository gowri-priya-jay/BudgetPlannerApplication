package com.myfinances.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.myfinances.dto.ExternalTransferResponseDTO;
import com.myfinances.service.ExternalTransferService;

@Controller
@RequestMapping("/external-transfers")
public class ExternalTransferController {
	
	@Autowired
    private ExternalTransferService transferService;

    @GetMapping("/{budgetId}")
    public ResponseEntity<List<ExternalTransferResponseDTO>> getTransfersByBudget(
            @PathVariable Long budgetId) {
        return ResponseEntity.ok(transferService.getTransfersByBudget(budgetId));
    }

    @GetMapping("/goal/{goalId}")
    public ResponseEntity<List<ExternalTransferResponseDTO>> getTransfersByGoal(
            @PathVariable Long goalId) {
        return ResponseEntity.ok(transferService.getTransfersByGoal(goalId));
    }


}
