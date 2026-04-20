package com.myfinances.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myfinances.dto.ExternalTransferResponseDTO;
import com.myfinances.entity.ExternalTransfer;
import com.myfinances.repo.ExternalTransferRepository;

@Service
public class ExternalTransferServiceImpl implements ExternalTransferService {

	@Autowired
	private ExternalTransferRepository transferRepo;

	@Override
	public List<ExternalTransferResponseDTO> getTransfersByBudget(Long budgetId) {
		return transferRepo.findByBudget_BudgetId(budgetId).stream().map(this::mapToDTO).toList();
	}

	@Override
	public List<ExternalTransferResponseDTO> getTransfersByGoal(Long goalId) {
		return transferRepo.findByGoal_GoalId(goalId).stream().map(this::mapToDTO).toList();
	}

	// For Mapping response dto
	private ExternalTransferResponseDTO mapToDTO(ExternalTransfer transfer) {

		ExternalTransferResponseDTO dto = new ExternalTransferResponseDTO();
		dto.setTransferId(transfer.getTransferId());
		dto.setAmount(transfer.getAmount());
		// Budget details
		dto.setBudgetId(transfer.getBudget().getBudgetId());
		dto.setMonth(transfer.getBudget().getMonth());
		dto.setYear(transfer.getBudget().getYear());
		// Goal details
		dto.setGoalId(transfer.getGoal().getGoalId());
		dto.setGoalName(transfer.getGoal().getGoalName());
		return dto;
	}

}
