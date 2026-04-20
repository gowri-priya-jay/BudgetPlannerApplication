package com.myfinances.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.myfinances.dto.BudgetCategoryBreakdownResponseDTO;
import com.myfinances.dto.BudgetRequestDTO;
import com.myfinances.dto.BudgetResponseDTO;
import com.myfinances.dto.BudgetUpdateRequestDTO;
import com.myfinances.service.AllocationService;
import com.myfinances.service.BudgetService;

@Controller
@RequestMapping("/budget")
public class BudgetController {

	@Autowired
	BudgetService budgetService;

	@Autowired
	AllocationService allocationService;

	@PostMapping("/createBudget")
	public ResponseEntity<BudgetResponseDTO> createBudget(@RequestBody BudgetRequestDTO budgetRequest) {
		return ResponseEntity.ok(budgetService.createBudget(budgetRequest));
	}

	@GetMapping("/getAllBudgets")
	public ResponseEntity<List<BudgetResponseDTO>> getAllBudgets() {
		return ResponseEntity.ok(budgetService.getAllBudgets());
	}

	@GetMapping("/{budgetId}")
	public ResponseEntity<BudgetResponseDTO> getBudgetDetail(@PathVariable Long budgetId) {
		return ResponseEntity.ok(budgetService.getBudgetDetail(budgetId));
	}

	@PutMapping("/updateBudget")
	public ResponseEntity<?> updateBudget(@RequestBody BudgetUpdateRequestDTO req) {
		BudgetResponseDTO updated = budgetService.updateBudget(req);
		return ResponseEntity.ok(updated);
	}

	@DeleteMapping("/delete/{budgetId}")
	public ResponseEntity<?> deleteBudget(@PathVariable Long budgetId) {
		budgetService.deleteBudget(budgetId);
		return ResponseEntity.ok("Budget deleted successfully");
	}

	@GetMapping("/getLatestCompletedBudget")
	public ResponseEntity<?> getLatestCompletedBudget() {
	    BudgetResponseDTO budget = budgetService.getLatestCompletedBudget();
	    if (budget == null) {
	        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No completed budget available");
	    }
	    return ResponseEntity.ok(budget);
	}

	@GetMapping("/getBudgetBreakdown/{budgetId}")
	public ResponseEntity<?> getBudgetBreakdown(@PathVariable Long budgetId){
		List<BudgetCategoryBreakdownResponseDTO> res = budgetService.getBudgetBreakdown(budgetId);
		return ResponseEntity.ok(res);
	}

	@GetMapping("/getBudgetedYear")
	public ResponseEntity<?> getBudgetedYear(){
		List<Integer> years = budgetService.getBudgetedYear();
		return ResponseEntity.ok(years);
	}
	
	@GetMapping("/hasCompletedBudget")
	public ResponseEntity<Boolean> hasCompletedBudget(){
		boolean exists = budgetService.hasCompletedbudget();
		return ResponseEntity.ok(exists);
	}
}
