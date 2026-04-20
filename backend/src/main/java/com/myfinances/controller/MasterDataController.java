package com.myfinances.controller;

import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestParam;

import com.myfinances.dto.ExpenseCategoryResponseDTO;
import com.myfinances.dto.ExpenseItemResponseDTO;
import com.myfinances.dto.IncomeItemResponseDTO;
import com.myfinances.service.MasterDataService;
import com.myfinances.util.Constants;

@Controller
@RequestMapping("/master")
public class MasterDataController {

    @Autowired
    private MasterDataService masterDataService;

    // Expense Category Methods
    @GetMapping("/getExpenseCategories")
    public ResponseEntity<List<ExpenseCategoryResponseDTO>> getExpenseCategories() {
        return ResponseEntity.ok(masterDataService.getExpenseCategories());
    }
    
    @PostMapping("/createExpenseCategory")
    public ResponseEntity<?> createExpenseCategory(@RequestBody Map<String, Object> body){
    	String categoryName = body.get("categoryName").toString();
		return ResponseEntity.ok(masterDataService.createExpenseCategory(categoryName));	
    }
    
    @PutMapping("/updateExpenseCategory/{categoryId}")
    public ResponseEntity<?> updateExpenseCategory(@PathVariable Long categoryId,@RequestBody Map<String, Object> body){
    	String categoryName = body.get("categoryName").toString();
        return ResponseEntity.ok(masterDataService.updateExpenseCategory(categoryId, categoryName));
    }
    
    @DeleteMapping("/deleteExpenseCategory/{categoryId}")
    public ResponseEntity<?> deleteExpenseCategory(@PathVariable Long categoryId){
    	masterDataService.deleteExpenseCategory(categoryId);
    	return ResponseEntity.ok(Constants.CATEGORY_DELETE_MESSAGE);
    }
    
    // Income Item Methods
    @GetMapping("/getIncomeItems")
    public ResponseEntity<List<IncomeItemResponseDTO>> getIncomeItems() {
        return ResponseEntity.ok(masterDataService.getIncomeItems());
    }

    @PostMapping("/createIncomeItem")
    public ResponseEntity<?> createIncomeItem(@RequestBody Map<String, Object> body){
    	String incomeName = body.get("incomeName").toString();
		return ResponseEntity.ok(masterDataService.createIncomeItem(incomeName));
    	
    }
    
    @PutMapping("/updateIncomeItem/{incomeId}")
    public ResponseEntity<?> updateIncomeItem(@PathVariable Long incomeId,@RequestBody Map<String, Object> body){
    	String incomeName = body.get("incomeName").toString();
        return ResponseEntity.ok(masterDataService.updateIncomeItem(incomeId, incomeName));
    }
    
    @DeleteMapping("/deleteIncomeItem/{incomeId}")
    public ResponseEntity<?> deleteIncomeItem(@PathVariable Long incomeId){
    	masterDataService.deleteIncomeItem(incomeId);
    	return ResponseEntity.ok(Constants.INCOME_DELETE_MESSAGE);
    }
    
    // Methods for Expense Items
    @GetMapping("/getExpenseItems")
    public ResponseEntity<List<ExpenseItemResponseDTO>> getExpenseItems() {
        return ResponseEntity.ok(masterDataService.getExpenseItems());
    }
    
    @PostMapping("/createExpenseItem")
    public ResponseEntity<?> createExpenseItem(@RequestBody Map<String, Object> body){
    	String expenseName = body.get("expenseName").toString();
    	Long categoryId = Long.valueOf(body.get("categoryId").toString());
		return ResponseEntity.ok(masterDataService.createExpenseItem(expenseName,categoryId));
    }
    
    @PutMapping("/updateExpenseItem/{expenseId}")
    public ResponseEntity<?> updateExpenseItem(@PathVariable Long expenseId,@RequestBody Map<String, Object> body){
    	String expenseName = body.get("expenseName").toString();
    	Long categoryId = Long.valueOf(body.get("categoryId").toString());
        return ResponseEntity.ok(masterDataService.updateExpenseItem(expenseId, expenseName,categoryId));
    }
    
    @DeleteMapping("/deleteExpenseItem/{expenseId}")
    public ResponseEntity<?> deleteExpenseItem(@PathVariable Long expenseId){
    	masterDataService.deleteExpenseItem(expenseId);
    	return ResponseEntity.ok(Constants.EXPENSE_DELETE_MESSAGE);
    }
    
    @GetMapping("/getExpenseItemsByCategory")
    public ResponseEntity<List<ExpenseItemResponseDTO>> getItemsByCategory(@RequestParam Long categoryId) {
        List<ExpenseItemResponseDTO> items = masterDataService.getItemsByCategory(categoryId);
        return ResponseEntity.ok(items);
    }
    
}