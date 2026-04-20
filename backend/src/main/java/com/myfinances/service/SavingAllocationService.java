package com.myfinances.service;

import java.util.List;

import com.myfinances.dto.AllocationItemResponseDTO;
import com.myfinances.dto.SavingAllocationRequestDTO;
import com.myfinances.dto.SavingAllocationResponseDTO;

public interface SavingAllocationService {

	SavingAllocationResponseDTO saveAllocations(SavingAllocationRequestDTO dto);

	List<AllocationItemResponseDTO> getAllocationsForBudget(Long budgetId);

}
