package com.myfinances.controller;

import java.util.List;

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

import com.myfinances.dto.FilterRequestDTO;
import com.myfinances.dto.GoalReportResponseDTO;
import com.myfinances.dto.SavingGoalRequestDTO;
import com.myfinances.dto.SavingGoalResponseDTO;
import com.myfinances.dto.TransferGoalAmountRequestDTO;
import com.myfinances.dto.WithdrawAmountRequestDTO;
import com.myfinances.service.GoalService;
import com.myfinances.util.Constants;

@Controller
@RequestMapping("/goal")
public class GoalController {
	
	@Autowired
    private GoalService goalService;

    @PostMapping("/createGoal")
    public ResponseEntity<SavingGoalResponseDTO> createGoal(@RequestBody SavingGoalRequestDTO dto) {
        return ResponseEntity.ok(goalService.createGoal(dto));
    }

    @GetMapping("/getAllGoals")
    public ResponseEntity<List<SavingGoalResponseDTO>> getAllGoals() {
        return ResponseEntity.ok(goalService.getAllGoals());
    }
    
    @GetMapping("/getGoal/{goalId}")
    public ResponseEntity<SavingGoalResponseDTO> getGoalByGoalId(@PathVariable Long goalId) {
    	return ResponseEntity.ok(goalService.getGoalByGoalId(goalId));
    }

    @PutMapping("/updateGoal/{goalId}")
    public ResponseEntity<SavingGoalResponseDTO> updateGoal(
            @PathVariable Long goalId,
            @RequestBody SavingGoalRequestDTO dto) {
        return ResponseEntity.ok(goalService.updateGoal(goalId, dto));
    }

    @DeleteMapping("/deleteGoal/{goalId}")
    public ResponseEntity<String> deleteGoal(@PathVariable Long goalId) {
    	goalService.deleteGoal(goalId);
        return ResponseEntity.ok(Constants.GOAL_DELETE_MESSAGE);
    }
    
    @PostMapping("/transferAmount")
    public ResponseEntity<?> transferGoalAmount(@RequestBody TransferGoalAmountRequestDTO dto){
    	goalService.transferGoalAmount(dto);
    	return ResponseEntity.ok("Amount has been transfered successfully");
    }
    
    @PostMapping("/withdrawAmount")
    public ResponseEntity<?> withdrawGoalAmount(@RequestBody WithdrawAmountRequestDTO dto){
    	goalService.withdrawGoalAmount(dto);
    	return ResponseEntity.ok("Amount has been withdrawn successfully");
    }
    
    @PostMapping("/allocation-report")
    public ResponseEntity<GoalReportResponseDTO> getAllocationReport(@RequestBody FilterRequestDTO dto){
    	GoalReportResponseDTO response = goalService.getAllocationReport(dto);
    	return ResponseEntity.ok(response);
    }

}
