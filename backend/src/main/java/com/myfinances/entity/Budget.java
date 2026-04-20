package com.myfinances.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "budget",uniqueConstraints = {@UniqueConstraint(columnNames = {"month", "year"})})
public class Budget {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_id")
    private Long budgetId;

	@Column(name = "month")
    private String month;
    
	@Column(name = "year")
    private Integer year;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
	private Account account;

    @Column(name = "total_actual_income",precision = 10, scale = 2)
    private BigDecimal totalActualIncome;

    @Column(name = "total_actual_expense",precision = 10, scale = 2)
    private BigDecimal totalActualExpense;

    @Column(name = "total_planned_income",precision = 10, scale = 2)
    private BigDecimal totalPlannedIncome;

    @Column(name = "total_planned_expense",precision = 10, scale = 2)
    private BigDecimal totalPlannedExpense;

    @Column(name = "planned_savings",precision = 10, scale = 2)
    private BigDecimal plannedSavings;
    
    @Column(name = "actual_savings",precision = 10, scale = 2)
    private BigDecimal actualSavings;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MonthlyExpense> monthlyExpenses;
    
    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MonthlyIncome> monthlyIncome;
    
	public Long getBudgetId() {
		return budgetId;
	}

	public void setBudgetId(Long budgetId) {
		this.budgetId = budgetId;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public int getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public BigDecimal getTotalActualIncome() {
		return totalActualIncome;
	}

	public void setTotalActualIncome(BigDecimal totalActualIncome) {
		this.totalActualIncome = totalActualIncome;
	}

	public BigDecimal getTotalActualExpense() {
		return totalActualExpense;
	}

	public void setTotalActualExpense(BigDecimal totalActualExpense) {
		this.totalActualExpense = totalActualExpense;
	}

	public BigDecimal getTotalPlannedIncome() {
		return totalPlannedIncome;
	}

	public void setTotalPlannedIncome(BigDecimal totalPlannedIncome) {
		this.totalPlannedIncome = totalPlannedIncome;
	}

	public BigDecimal getTotalPlannedExpense() {
		return totalPlannedExpense;
	}

	public void setTotalPlannedExpense(BigDecimal totalPlannedExpense) {
		this.totalPlannedExpense = totalPlannedExpense;
	}
	
	public BigDecimal getPlannedSavings() {
		return plannedSavings;
	}

	public void setPlannedSavings(BigDecimal plannedSavings) {
		this.plannedSavings = plannedSavings;
	}

	public BigDecimal getActualSavings() {
		return actualSavings;
	}

	public void setActualSavings(BigDecimal actualSavings) {
		this.actualSavings = actualSavings;
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

	public List<MonthlyExpense> getMonthlyExpenses() {
		return monthlyExpenses;
	}

	public void setMonthlyExpenses(List<MonthlyExpense> monthlyExpenses) {
		this.monthlyExpenses = monthlyExpenses;
	}

	public List<MonthlyIncome> getMonthlyIncome() {
		return monthlyIncome;
	}

	public void setMonthlyIncome(List<MonthlyIncome> monthlyIncome) {
		this.monthlyIncome = monthlyIncome;
	}

}
