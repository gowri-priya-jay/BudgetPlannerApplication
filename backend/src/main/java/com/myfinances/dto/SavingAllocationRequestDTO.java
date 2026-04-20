package com.myfinances.dto;

import java.util.List;

public class SavingAllocationRequestDTO {
	
	private Long budgetId;
	
	private List<AllocationItemRequestDTO> allocations;

	public Long getBudgetId() {
		return budgetId;
	}

	public void setBudgetId(Long budgetId) {
		this.budgetId = budgetId;
	}

	public List<AllocationItemRequestDTO> getAllocations() {
		return allocations;
	}

	public void setAllocations(List<AllocationItemRequestDTO> allocations) {
		this.allocations = allocations;
	}

}
