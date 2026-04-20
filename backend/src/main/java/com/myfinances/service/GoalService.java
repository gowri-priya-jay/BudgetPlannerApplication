package com.myfinances.service;

import java.math.BigDecimal;
import java.util.List;

import com.myfinances.dto.FilterRequestDTO;
import com.myfinances.dto.GoalReportResponseDTO;
import com.myfinances.dto.SavingGoalRequestDTO;
import com.myfinances.dto.SavingGoalResponseDTO;
import com.myfinances.dto.TransferGoalAmountRequestDTO;
import com.myfinances.dto.WithdrawAmountRequestDTO;
import com.myfinances.entity.SavingGoal;

public interface GoalService {

	SavingGoalResponseDTO createGoal(SavingGoalRequestDTO dto);
	
	List<SavingGoalResponseDTO> getAllGoals();
	
	SavingGoalResponseDTO getGoalByGoalId(Long goalId);
	
	SavingGoalResponseDTO updateGoal(Long goalId, SavingGoalRequestDTO dto);
	
	void deleteGoal(Long goalId);

	void decreaseSavedAmount(SavingGoal goal, BigDecimal allocatedAmount);

	void increaseSavedAmount(SavingGoal goal, BigDecimal allocatedAmount);

	void transferGoalAmount(TransferGoalAmountRequestDTO dto);

	void withdrawGoalAmount(WithdrawAmountRequestDTO dto);

	GoalReportResponseDTO getAllocationReport(FilterRequestDTO dto);

}
