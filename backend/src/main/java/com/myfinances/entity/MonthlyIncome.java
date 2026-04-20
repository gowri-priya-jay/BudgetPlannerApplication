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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "monthly_income", uniqueConstraints = {@UniqueConstraint(columnNames = {"budgetId", "incomeId"})})
public class MonthlyIncome {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "monthly_income_id") 
	private Long monthlyIncomeId;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;

	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "income_id", nullable = false)
    private IncomeItem incomeItem;
	
	@Column(name = "planned_income",precision = 10, scale = 2)
	private BigDecimal plannedIncome;
	
	@Column(name = "actual_income",precision = 10, scale = 2)
	private BigDecimal actualIncome;
	
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	public Long getMonthlyIncomeId() {
		return monthlyIncomeId;
	}

	public void setMonthlyIncomeId(Long monthlyIncomeId) {
		this.monthlyIncomeId = monthlyIncomeId;
	}

	public Budget getBudget() {
		return budget;
	}

	public void setBudget(Budget budget) {
		this.budget = budget;
	}

	public IncomeItem getIncomeItem() {
		return incomeItem;
	}

	public void setIncomeItem(IncomeItem incomeItem) {
		this.incomeItem = incomeItem;
	}

	public BigDecimal getPlannedIncome() {
		return plannedIncome;
	}

	public void setPlannedIncome(BigDecimal plannedIncome) {
		this.plannedIncome = plannedIncome;
	}

	public BigDecimal getActualIncome() {
		return actualIncome;
	}

	public void setActualIncome(BigDecimal actualIncome) {
		this.actualIncome = actualIncome;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

}
