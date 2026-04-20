package com.myfinances.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@Table(name = "monthly_expense", uniqueConstraints = { @UniqueConstraint(columnNames = { "budgetId", "expenseId" }) })
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MonthlyExpense {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "monthly_expense_id")
	private Long monthlyExpenseId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "budget_id", nullable = false)
	private Budget budget;

	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "expense_id", nullable = false)
    private ExpenseItem expenseItem;

	@Column(name = "planned_expense", precision = 10, scale = 2)
	private BigDecimal plannedExpense;

	@Column(name = "actual_expense", precision = 10, scale = 2)
	private BigDecimal actualExpense;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	public Long getMonthlyExpenseId() {
		return monthlyExpenseId;
	}

	public void setMonthlyExpenseId(Long monthlyExpenseId) {
		this.monthlyExpenseId = monthlyExpenseId;
	}

	public Budget getBudget() {
		return budget;
	}

	public void setBudget(Budget budget) {
		this.budget = budget;
	}

	public ExpenseItem getExpenseItem() {
		return expenseItem;
	}

	public void setExpenseItem(ExpenseItem expenseItem) {
		this.expenseItem = expenseItem;
	}

	public BigDecimal getPlannedExpense() {
		return plannedExpense;
	}

	public void setPlannedExpense(BigDecimal plannedExpense) {
		this.plannedExpense = plannedExpense;
	}

	public BigDecimal getActualExpense() {
		return actualExpense;
	}

	public void setActualExpense(BigDecimal actualExpense) {
		this.actualExpense = actualExpense;
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
