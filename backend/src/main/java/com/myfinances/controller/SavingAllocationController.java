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

import com.myfinances.dto.AllocationItemResponseDTO;
import com.myfinances.dto.SavingAllocationRequestDTO;
import com.myfinances.dto.SavingAllocationResponseDTO;
import com.myfinances.service.SavingAllocationService;

@Controller
@RequestMapping("/allocations")
public class SavingAllocationController {
	
	@Autowired
    SavingAllocationService allocationService;
	
	@PostMapping("/saveAllocation")
    public ResponseEntity<SavingAllocationResponseDTO> saveAllocations(
            @RequestBody SavingAllocationRequestDTO dto) {
        return ResponseEntity.ok(allocationService.saveAllocations(dto));
    }

	@GetMapping("/{budgetId}")
    public ResponseEntity<List<AllocationItemResponseDTO>> getAllocations(@PathVariable Long budgetId) {
        return ResponseEntity.ok(allocationService.getAllocationsForBudget(budgetId));
    }

}
