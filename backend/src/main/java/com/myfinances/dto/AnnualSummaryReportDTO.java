package com.myfinances.dto;

import java.awt.image.BufferedImage;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class AnnualSummaryReportDTO {

    private int year;

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal totalSavings;

    private BigDecimal averageIncome;
    private BigDecimal averageExpense;
    private BigDecimal averageSavings;

    private String highestSpendingMonth;
    private String lowestSpendingMonth;
    private int overspentMonthsCount;
    private int underspentMonthsCount;

    private List<MonthlyOverviewRow> monthlyOverview;
    private List<CategoryBreakdownRow> categoryBreakdown;

    private BufferedImage monthlyTrendChart;
    private BufferedImage categoryBreakdownChart;

    public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public BigDecimal getTotalIncome() {
		return totalIncome;
	}

	public void setTotalIncome(BigDecimal totalIncome) {
		this.totalIncome = totalIncome;
	}

	public BigDecimal getTotalExpense() {
		return totalExpense;
	}

	public void setTotalExpense(BigDecimal totalExpense) {
		this.totalExpense = totalExpense;
	}

	public BigDecimal getTotalSavings() {
		return totalSavings;
	}

	public void setTotalSavings(BigDecimal totalSavings) {
		this.totalSavings = totalSavings;
	}

	public BigDecimal getAverageIncome() {
		return averageIncome;
	}

	public void setAverageIncome(BigDecimal averageIncome) {
		this.averageIncome = averageIncome;
	}

	public BigDecimal getAverageExpense() {
		return averageExpense;
	}

	public void setAverageExpense(BigDecimal averageExpense) {
		this.averageExpense = averageExpense;
	}

	public BigDecimal getAverageSavings() {
		return averageSavings;
	}

	public void setAverageSavings(BigDecimal averageSavings) {
		this.averageSavings = averageSavings;
	}

	public String getHighestSpendingMonth() {
		return highestSpendingMonth;
	}

	public void setHighestSpendingMonth(String highestSpendingMonth) {
		this.highestSpendingMonth = highestSpendingMonth;
	}

	public String getLowestSpendingMonth() {
		return lowestSpendingMonth;
	}

	public void setLowestSpendingMonth(String lowestSpendingMonth) {
		this.lowestSpendingMonth = lowestSpendingMonth;
	}

	public int getOverspentMonthsCount() {
		return overspentMonthsCount;
	}

	public void setOverspentMonthsCount(int overspentMonthsCount) {
		this.overspentMonthsCount = overspentMonthsCount;
	}

	public int getUnderspentMonthsCount() {
		return underspentMonthsCount;
	}

	public void setUnderspentMonthsCount(int underspentMonthsCount) {
		this.underspentMonthsCount = underspentMonthsCount;
	}

	public List<MonthlyOverviewRow> getMonthlyOverview() {
		return monthlyOverview;
	}

	public void setMonthlyOverview(List<MonthlyOverviewRow> monthlyOverview) {
		this.monthlyOverview = monthlyOverview;
	}

	public List<CategoryBreakdownRow> getCategoryBreakdown() {
		return categoryBreakdown;
	}

	public void setCategoryBreakdown(List<CategoryBreakdownRow> categoryBreakdown) {
		this.categoryBreakdown = categoryBreakdown;
	}

	public BufferedImage getMonthlyTrendChart() {
		return monthlyTrendChart;
	}

	public void setMonthlyTrendChart(BufferedImage monthlyTrendChart) {
		this.monthlyTrendChart = monthlyTrendChart;
	}

	public BufferedImage getCategoryBreakdownChart() {
		return categoryBreakdownChart;
	}

	public void setCategoryBreakdownChart(BufferedImage categoryBreakdownChart) {
		this.categoryBreakdownChart = categoryBreakdownChart;
	}

    public static class MonthlyOverviewRow {
    	
        private String month;
        private BigDecimal plannedIncome;
        private BigDecimal actualIncome;
        private BigDecimal plannedExpense;
        private BigDecimal actualExpense;
        private BigDecimal plannedSavings;
        private BigDecimal actualSavings;
        
		public String getMonth() {
			return month;
		}
		public void setMonth(String month) {
			this.month = month;
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
        
    }

    public static class CategoryBreakdownRow {
    	
        private String categoryName;
        private BigDecimal totalAmount;
        private List<CategoryItemRow> items = new ArrayList<>();
        private BufferedImage categoryChart;
        
        public CategoryBreakdownRow() {
            this.items = new ArrayList<>();
        }
        
		public String getCategoryName() {
			return categoryName;
		}
		public void setCategoryName(String categoryName) {
			this.categoryName = categoryName;
		}
		public BigDecimal getTotalAmount() {
			return totalAmount;
		}
		public void setTotalAmount(BigDecimal totalAmount) {
			this.totalAmount = totalAmount;
		}
		public List<CategoryItemRow> getItems() {
			if (items == null) items = new ArrayList<>();
            return items;
		}
		public void setItems(List<CategoryItemRow> items) {
			 this.items = (items != null) ? items : new ArrayList<>();
		}
		public BufferedImage getCategoryChart() {
			return categoryChart;
		}
		public void setCategoryChart(BufferedImage categoryChart) {
			this.categoryChart = categoryChart;
		}     
        
    }

    public static class CategoryItemRow {
    	
        private String itemName;
        private BigDecimal totalAmount;
        
		public String getItemName() {
			return itemName;
		}
		public void setItemName(String itemName) {
			this.itemName = itemName;
		}
		public BigDecimal getTotalAmount() {
			return totalAmount;
		}
		public void setTotalAmount(BigDecimal totalAmount) {
			this.totalAmount = totalAmount;
		}

    }
}
