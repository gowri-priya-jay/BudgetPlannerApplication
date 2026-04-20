package com.myfinances.dto;

import java.math.BigDecimal;
import java.util.List;

public class GoalReportResponseDTO {
	
	
	private BigDecimal totalAllocatedAmount;
	
	private List<GoalAllocationResponseDTO> allocationDetails;

	public BigDecimal getTotalAllocatedAmount() {
		return totalAllocatedAmount;
	}

	public void setTotalAllocatedAmount(BigDecimal totalAllocatedAmount) {
		this.totalAllocatedAmount = totalAllocatedAmount;
	}

	public List<GoalAllocationResponseDTO> getAllocationDetails() {
		return allocationDetails;
	}

	public void setAllocationDetails(List<GoalAllocationResponseDTO> allocationDetails) {
		this.allocationDetails = allocationDetails;
	}

}
