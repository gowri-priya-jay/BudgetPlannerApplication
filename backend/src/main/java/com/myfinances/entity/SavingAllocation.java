package com.myfinances.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "saving_allocation")
public class SavingAllocation {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "allocation_id")
	private Long allocationId;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
	private SavingGoal goal;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;
	
	@Column(name = "allocated_amount")
	private BigDecimal allocatedAmount;
	
	@Column(name = "is_external")
	private Boolean isExternal;
	
	@Column(name = "created_at")
	private LocalDateTime createdAt;

	public Long getAllocationId() {
		return allocationId;
	}

	public void setAllocationId(Long allocationId) {
		this.allocationId = allocationId;
	}

	public SavingGoal getGoal() {
		return goal;
	}

	public void setGoal(SavingGoal goal) {
		this.goal = goal;
	}

	public Budget getBudget() {
		return budget;
	}

	public void setBudget(Budget budget) {
		this.budget = budget;
	}

	public BigDecimal getAllocatedAmount() {
		return allocatedAmount;
	}

	public void setAllocatedAmount(BigDecimal allocatedAmount) {
		this.allocatedAmount = allocatedAmount;
	}

	public Boolean getIsExternal() {
		return isExternal;
	}

	public void setIsExternal(Boolean isExternal) {
		this.isExternal = isExternal;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
}
