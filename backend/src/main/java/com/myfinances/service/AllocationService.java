package com.myfinances.service;

import com.myfinances.dto.SavingAllocationRequestDTO;

public interface AllocationService {

	void allocateSavings(SavingAllocationRequestDTO requestDto);

}
