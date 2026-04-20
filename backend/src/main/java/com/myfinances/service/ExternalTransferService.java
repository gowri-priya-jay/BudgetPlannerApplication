package com.myfinances.service;

import java.util.List;

import com.myfinances.dto.ExternalTransferResponseDTO;

public interface ExternalTransferService {

	List<ExternalTransferResponseDTO> getTransfersByBudget(Long budgetId);

	List<ExternalTransferResponseDTO> getTransfersByGoal(Long goalId);

}
