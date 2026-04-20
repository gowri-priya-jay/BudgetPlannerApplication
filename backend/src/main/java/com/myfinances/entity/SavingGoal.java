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
@Table(name = "saving_goals")
public class SavingGoal {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "goal_id")
	private Long goalId;
	
	@Column(name = "goal_name")
	private String goalName;
	
	@Column(name = "target_amount")
	private BigDecimal targetAmount;
	
	@Column(name = "saved_amount")
    private BigDecimal savedAmount;

	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "account_id")
	private Account account;
	
	@Column(name = "is_external")
	private Boolean isExternal;
	
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	public Long getGoalId() {
		return goalId;
	}

	public void setGoalId(Long goalId) {
		this.goalId = goalId;
	}

	public String getGoalName() {
		return goalName;
	}

	public void setGoalName(String goalName) {
		this.goalName = goalName;
	}

	public BigDecimal getTargetAmount() {
		return targetAmount;
	}

	public void setTargetAmount(BigDecimal targetAmount) {
		this.targetAmount = targetAmount;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
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

	public BigDecimal getSavedAmount() {
		return savedAmount;
	}

	public void setSavedAmount(BigDecimal savedAmount) {
		this.savedAmount = savedAmount;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
	
}
