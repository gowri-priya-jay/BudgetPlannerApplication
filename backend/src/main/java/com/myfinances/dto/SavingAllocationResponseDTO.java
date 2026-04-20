package com.myfinances.dto;

import java.math.BigDecimal;
import java.util.List;

public class SavingAllocationResponseDTO {
	
	 private Long budgetId;
	 
	 private BigDecimal totalAllocated;
	 
	 private List<AllocationItemResponseDTO> allocations;

	public Long getBudgetId() {
		return budgetId;
	}

	public void setBudgetId(Long budgetId) {
		this.budgetId = budgetId;
	}

	public BigDecimal getTotalAllocated() {
		return totalAllocated;
	}

	public void setTotalAllocated(BigDecimal totalAllocated) {
		this.totalAllocated = totalAllocated;
	}

	public List<AllocationItemResponseDTO> getAllocations() {
		return allocations;
	}

	public void setAllocations(List<AllocationItemResponseDTO> allocations) {
		this.allocations = allocations;
	}
	 
}
