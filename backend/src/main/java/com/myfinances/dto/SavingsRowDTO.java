package com.myfinances.dto;

import java.math.BigDecimal;
import java.util.List;

public class SavingsRowDTO {

	private String month;
	
	private BigDecimal plannedSavings;
	
	private BigDecimal totalSavings;
	
	private BigDecimal allocatedAmount;
	
	private String allocationStatus;
	
	private List<AllocationItemResponseDTO> allocations;
	
	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public BigDecimal getPlannedSavings() {
		return plannedSavings;
	}

	public void setPlannedSavings(BigDecimal plannedSavings) {
		this.plannedSavings = plannedSavings;
	}

	public BigDecimal getTotalSavings() {
		return totalSavings;
	}

	public void setTotalSavings(BigDecimal totalSavings) {
		this.totalSavings = totalSavings;
	}

	public BigDecimal getAllocatedAmount() {
		return allocatedAmount;
	}

	public void setAllocatedAmount(BigDecimal allocatedAmount) {
		this.allocatedAmount = allocatedAmount;
	}

	public String getAllocationStatus() {
		return allocationStatus;
	}

	public void setAllocationStatus(String allocationStatus) {
		this.allocationStatus = allocationStatus;
	}

	public List<AllocationItemResponseDTO> getAllocations() {
		return allocations;
	}

	public void setAllocations(List<AllocationItemResponseDTO> allocations) {
		this.allocations = allocations;
	}
	
}
