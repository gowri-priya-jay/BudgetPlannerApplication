package com.myfinances.service;

import java.awt.Color;
import java.awt.Font;
import java.awt.image.BufferedImage;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.knowm.xchart.BitmapEncoder;
import org.knowm.xchart.PieChart;
import org.knowm.xchart.PieChartBuilder;
import org.knowm.xchart.PieSeries;
import org.knowm.xchart.XYChart;
import org.knowm.xchart.XYChartBuilder;
import org.knowm.xchart.XYSeries;
import org.knowm.xchart.style.Styler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myfinances.dto.AllocationItemResponseDTO;
import com.myfinances.dto.AnnualExpenseCategoryResponseDTO;
import com.myfinances.dto.AnnualReportResponseDTO;
import com.myfinances.dto.AnnualSummaryReportDTO;
import com.myfinances.dto.AnnualSummaryReportDTO.CategoryBreakdownRow;
import com.myfinances.dto.AnnualSummaryReportDTO.CategoryItemRow;
import com.myfinances.dto.AnnualSummaryReportDTO.MonthlyOverviewRow;
import com.myfinances.dto.FilterRequestDTO;
import com.myfinances.dto.BudgetReportResponseDTO;
import com.myfinances.dto.ExpenseRowDTO;
import com.myfinances.dto.IncomeRowDTO;
import com.myfinances.dto.MonthlyTrendResponseDTO;
import com.myfinances.dto.SavingsRowDTO;
import com.myfinances.entity.Budget;
import com.myfinances.entity.ExpenseCategory;
import com.myfinances.entity.ExpenseItem;
import com.myfinances.entity.MonthlyExpense;
import com.myfinances.entity.MonthlyIncome;
import com.myfinances.repo.BudgetRepository;
import com.myfinances.repo.ExpenseItemRepository;
import com.myfinances.repo.IncomeItemRepository;
import com.myfinances.repo.MonthlyExpenseRepository;
import com.myfinances.repo.MonthlyIncomeRepository;
import com.myfinances.repo.SavingAllocationRepository;

@Service
public class ReportServiceImpl implements ReportService {

	@Autowired
	BudgetRepository budgetRepo;

	@Autowired
	MonthlyIncomeRepository monthlyIncomeRepo;

	@Autowired
	MonthlyExpenseRepository monthlyExpenseRepo;
	
	@Autowired
	IncomeItemRepository incomeItemRepo;
	
	@Autowired
	ExpenseItemRepository expenseItemRepo;
	
	@Autowired
	SavingAllocationRepository allocationRepo;
	
	@Autowired
	SavingAllocationService allocationService;

	@Override
	public AnnualReportResponseDTO getAnnualSummaryReport(int year) {

		List<Budget> budgets = budgetRepo.findByYear(year);

		if (budgets == null || budgets.isEmpty()) {
			return null;
		}

		BigDecimal totalIncome = budgets.stream().map(b -> safe(b.getTotalActualIncome())).reduce(BigDecimal.ZERO,
				BigDecimal::add);
		BigDecimal totalExpense = budgets.stream().map(b -> safe(b.getTotalActualExpense())).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		BigDecimal totalSavings = budgets.stream().map(b -> safe(b.getActualSavings())).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		BigDecimal savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0
				? totalSavings.divide(totalIncome, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
				: BigDecimal.ZERO;

		// ---------- AVERAGES ----------
		int months = budgets.size();

		BigDecimal avgMonthlyIncome = totalIncome.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

		BigDecimal avgMonthlyExpense = totalExpense.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

		BigDecimal avgMonthlySavings = totalSavings.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

		// ---------- HIGHEST & LOWEST SPENDING MONTH ----------
		Budget highest = budgets.stream().max(Comparator.comparing(b -> safe(b.getTotalActualExpense()))).orElse(null);

		Budget lowest = budgets.stream().min(Comparator.comparing(b -> safe(b.getTotalActualExpense()))).orElse(null);

		String highestSpendingMonth = highest != null ? highest.getMonth() : null;

		String lowestSpendingMonth = lowest != null ? lowest.getMonth() : null;

		// ---------- OVERSPENT VS UNDER BUDGET ----------
		int overspentMonths = 0;
		int underBudgetMonths = 0;

		BigDecimal overspentThreshold = new BigDecimal("1500");
		BigDecimal underspentThreshold = new BigDecimal("2500");

		// Category totals (expenses only)
		List<AnnualExpenseCategoryResponseDTO> categoryTotals = getAnnualExpenseCategoryBreakdown(year);
		List<MonthlyTrendResponseDTO> monthlyTrend = new ArrayList<>();

		for (Budget b : budgets) {
			MonthlyTrendResponseDTO dto = new MonthlyTrendResponseDTO();
			dto.setMonth(b.getMonth().substring(0, 3));
			dto.setIncome(b.getTotalActualIncome());
			dto.setExpense(b.getTotalActualExpense());
			dto.setSavings(b.getActualSavings());
			monthlyTrend.add(dto);
			BigDecimal savings = safe(b.getActualSavings());
			if (savings.compareTo(overspentThreshold) < 0) {
				overspentMonths++;
			} else if (savings.compareTo(underspentThreshold) > 0) {
				underBudgetMonths++;
			}
		}
		AnnualReportResponseDTO dto = new AnnualReportResponseDTO();
		dto.setYear(year);
		dto.setTotalIncome(totalIncome);
		dto.setTotalExpense(totalExpense);
		dto.setTotalSavings(totalSavings);
		dto.setAvgMonthlyIncome(avgMonthlyIncome);
		dto.setAvgMonthlyExpense(avgMonthlyExpense);
		dto.setAvgMonthlySavings(avgMonthlySavings);
		dto.setHighestSpendingMonth(highestSpendingMonth);
		dto.setLowestSpendingMonth(lowestSpendingMonth);
		dto.setOverspentMonths(overspentMonths);
		dto.setUnderBudgetMonths(underBudgetMonths);
		dto.setCategoryTotals(categoryTotals);
		dto.setMonthlyTrend(monthlyTrend);
		dto.setSavingsRate(savingsRate);
		return dto;
	}

	private BigDecimal safe(BigDecimal value) {
		return value == null ? BigDecimal.ZERO : value;
	}

	public List<AnnualExpenseCategoryResponseDTO> getAnnualExpenseCategoryBreakdown(int year) {

		List<Budget> budgets = budgetRepo.findByYear(year);
		if (budgets.isEmpty())
			return Collections.emptyList();
		List<Long> budgetIds = budgets.stream().map(Budget::getBudgetId).toList();

		// Step 2: Get all monthly expenses for these budgets
		List<MonthlyExpense> monthlyExpenses = monthlyExpenseRepo.findByBudget_BudgetIdIn(budgetIds);
		if (monthlyExpenses.isEmpty())
			return Collections.emptyList();

		// Step 3: Group totals by category
		Map<String, BigDecimal> categoryTotals = new HashMap<>();

		for (MonthlyExpense me : monthlyExpenses) {
			ExpenseItem item = me.getExpenseItem();
			if (item == null)
				continue;
			ExpenseCategory category = item.getCategory();
			if (category == null)
				continue;

			String categoryName = category.getCategoryName();
			BigDecimal amount = safe(me.getActualExpense());

			categoryTotals.put(categoryName, categoryTotals.getOrDefault(categoryName, BigDecimal.ZERO).add(amount));
		}

		// Step 4: Compute total annual expense
		BigDecimal totalIncome = budgets.stream().map(b -> safe(b.getTotalActualIncome())).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		// Step 5: Build DTO list
		List<AnnualExpenseCategoryResponseDTO> result = new ArrayList<>();

		for (var entry : categoryTotals.entrySet()) {
			String categoryName = entry.getKey();
			BigDecimal amount = entry.getValue();

			AnnualExpenseCategoryResponseDTO dto = new AnnualExpenseCategoryResponseDTO();
			dto.setCategory(categoryName);
			dto.setAmount(amount);
			BigDecimal pct = amount.multiply(BigDecimal.valueOf(100)).divide(totalIncome, 2, RoundingMode.HALF_UP);
			dto.setPercentage(pct);
			result.add(dto);
		}
		return result;
	}

	@SuppressWarnings("deprecation")
	@Override
	public AnnualSummaryReportDTO buildAnnualSummary(int year) {
		List<Budget> budgets = budgetRepo.findByYearOrderByMonthAsc(year);
		List<Object[]> expenseRows = monthlyExpenseRepo.findCategoryBreakdownByYear(year);

		AnnualSummaryReportDTO dto = new AnnualSummaryReportDTO();
		dto.setYear(year);

		// Totals
		BigDecimal totalIncome = budgets.stream().map(Budget::getTotalActualIncome).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		BigDecimal totalExpense = budgets.stream().map(Budget::getTotalActualExpense).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		BigDecimal totalSavings = totalIncome.subtract(totalExpense);

		dto.setTotalIncome(totalIncome);
		dto.setTotalExpense(totalExpense);
		dto.setTotalSavings(totalSavings);

		int monthsCount = budgets.isEmpty() ? 1 : budgets.size();

		dto.setAverageIncome(totalIncome.divide(BigDecimal.valueOf(monthsCount), 2, BigDecimal.ROUND_HALF_UP));
		dto.setAverageExpense(totalExpense.divide(BigDecimal.valueOf(monthsCount), 2, BigDecimal.ROUND_HALF_UP));
		dto.setAverageSavings(totalSavings.divide(BigDecimal.valueOf(monthsCount), 2, BigDecimal.ROUND_HALF_UP));

		// Highest / lowest spending month
		Budget highest = budgets.stream().max(Comparator.comparing(Budget::getTotalActualExpense)).orElse(null);

		Budget lowest = budgets.stream().min(Comparator.comparing(Budget::getTotalActualExpense)).orElse(null);

		dto.setHighestSpendingMonth(highest != null ? highest.getMonth() : null);
		dto.setLowestSpendingMonth(lowest != null ? lowest.getMonth() : null);

		// Over/under spent counts
		int overspent = 0;
		int underspent = 0;
		for (Budget b : budgets) {
			int cmp = b.getTotalActualExpense().compareTo(b.getTotalPlannedExpense());
			if (cmp > 0)
				overspent++;
			else if (cmp < 0)
				underspent++;
		}
		dto.setOverspentMonthsCount(overspent);
		dto.setUnderspentMonthsCount(underspent);

		// Monthly overview
		List<MonthlyOverviewRow> monthlyOverview = new ArrayList<>();
		for (Budget b : budgets) {
			MonthlyOverviewRow row = new MonthlyOverviewRow();
			row.setMonth(b.getMonth());
			row.setPlannedIncome(b.getTotalPlannedIncome());
			row.setActualIncome(b.getTotalActualIncome());
			row.setPlannedExpense(b.getTotalPlannedExpense());
			row.setActualExpense(b.getTotalActualExpense());
			row.setPlannedSavings(b.getPlannedSavings());
			row.setActualSavings(b.getActualSavings());
			monthlyOverview.add(row);
		}
		dto.setMonthlyOverview(monthlyOverview);

		// Category breakdown with items
		Map<String, Map<String, BigDecimal>> categoryItemMap = new LinkedHashMap<>();
		for (Object[] row : expenseRows) {
			MonthlyExpense me = (MonthlyExpense) row[0];
			ExpenseItem item = (ExpenseItem) row[1];
			ExpenseCategory cat = (ExpenseCategory) row[2];

			String catName = cat.getCategoryName();
			String itemName = item.getExpenseName();
			BigDecimal amount = me.getActualExpense();

			categoryItemMap.computeIfAbsent(catName, k -> new LinkedHashMap<>()).merge(itemName, amount,
					BigDecimal::add);
		}

		List<CategoryBreakdownRow> categoryBreakdown = new ArrayList<>();
		for (Map.Entry<String, Map<String, BigDecimal>> catEntry : categoryItemMap.entrySet()) {
			CategoryBreakdownRow catRow = new CategoryBreakdownRow();
			catRow.setCategoryName(catEntry.getKey());
			List<CategoryItemRow> items = catEntry.getValue().entrySet().stream().map(e -> {
				CategoryItemRow ci = new CategoryItemRow();
				ci.setItemName(e.getKey());
				ci.setTotalAmount(e.getValue());
				return ci;
			}).collect(Collectors.toList());

			catRow.setItems(items);
			catRow.setTotalAmount(
					items.stream().map(CategoryItemRow::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add));
			catRow.setCategoryChart(buildMiniCategoryChart(catRow));
			categoryBreakdown.add(catRow);
		}

		dto.setCategoryBreakdown(categoryBreakdown);

		// Charts
		dto.setMonthlyTrendChart(buildMonthlyTrendChart(dto.getMonthlyOverview()));
		dto.setCategoryBreakdownChart(buildCategoryBreakdownChart(dto.getCategoryBreakdown()));

		return dto;
	}

	private static java.awt.image.BufferedImage buildMonthlyTrendChart(
			List<AnnualSummaryReportDTO.MonthlyOverviewRow> rows) {

		XYChart chart = new XYChartBuilder().width(500).height(300).title("Monthly Trend").xAxisTitle("Month")
				.yAxisTitle("Amount").build();

		chart.getStyler().setLegendVisible(true);
		chart.getStyler().setLegendPosition(Styler.LegendPosition.OutsideS);
		chart.getStyler().setLegendLayout(Styler.LegendLayout.Horizontal);

		chart.getStyler().setChartBackgroundColor(Color.WHITE);
		chart.getStyler().setPlotBackgroundColor(Color.WHITE);
		chart.getStyler().setPlotBorderVisible(false);

		chart.getStyler().setChartFontColor(new Color(60, 60, 60));
		chart.getStyler().setAxisTickLabelsColor(new Color(60, 60, 60));
		chart.getStyler().setAxisTickMarksColor(new Color(120, 120, 120));

		chart.getStyler().setMarkerSize(6);
		chart.getStyler().setDefaultSeriesRenderStyle(XYSeries.XYSeriesRenderStyle.Line);

		List<String> months = new ArrayList<>();
		List<Double> income = new ArrayList<>();
		List<Double> expense = new ArrayList<>();
		List<Double> savings = new ArrayList<>();

		for (AnnualSummaryReportDTO.MonthlyOverviewRow r : rows) {
			months.add(r.getMonth().substring(0, 3));
			income.add(r.getActualIncome().doubleValue());
			expense.add(r.getActualExpense().doubleValue());
			savings.add(r.getActualSavings().doubleValue());
		}

		List<Integer> x = new ArrayList<>();
		for (int i = 0; i < months.size(); i++)
			x.add(i + 1);

		XYSeries s1 = chart.addSeries("Income", x, income);
		s1.setLineColor(new Color(76, 175, 80));
		s1.setMarkerColor(new Color(76, 175, 80));

		XYSeries s2 = chart.addSeries("Expense", x, expense);
		s2.setLineColor(new Color(244, 67, 54));
		s2.setMarkerColor(new Color(244, 67, 54));

		XYSeries s3 = chart.addSeries("Savings", x, savings);
		s3.setLineColor(new Color(33, 150, 243));
		s3.setMarkerColor(new Color(33, 150, 243));

		chart.getStyler().setxAxisTickLabelsFormattingFunction(value -> {
			int index = value.intValue() - 1;
			if (index >= 0 && index < months.size()) {
				return months.get(index);
			}
			return "";
		});

		return BitmapEncoder.getBufferedImage(chart);
	}

	private static java.awt.image.BufferedImage buildCategoryBreakdownChart(
			List<AnnualSummaryReportDTO.CategoryBreakdownRow> rows) {

		PieChart chart = new PieChartBuilder().width(420).height(320).title("Yearly Expense Breakdown").build();

		chart.getStyler().setLegendVisible(true);
		chart.getStyler().setLegendPosition(Styler.LegendPosition.OutsideE);
		chart.getStyler().setLegendLayout(Styler.LegendLayout.Vertical);

		chart.getStyler().setDefaultSeriesRenderStyle(PieSeries.PieSeriesRenderStyle.Donut);

		chart.getStyler().setChartBackgroundColor(Color.WHITE);
		chart.getStyler().setPlotBackgroundColor(Color.WHITE);
		chart.getStyler().setPlotBorderVisible(false);

		chart.getStyler().setDonutThickness(0.35);

		chart.getStyler().setLabelsVisible(true);
		chart.getStyler().setLabelsFont(new Font("Helvetica", Font.BOLD, 12));
		chart.getStyler().setLabelsDistance(1.15);
		chart.getStyler().setDecimalPattern("#.#'%'");

		chart.getStyler().setSeriesColors(new Color[] { Color.decode("#8BC34A"), // Food
				Color.decode("#4DB6AC"), // Home
				Color.decode("#9575CD"), // Shopping
				Color.decode("#4FC3F7"), // Transportation
				Color.decode("#FFB74D"), // Entertainment
				Color.decode("#E57373"), // Medical
				Color.decode("#64B5F6"), // Subscription
				Color.decode("#90A4AE") // Others
		});

		double total = rows.stream().map(AnnualSummaryReportDTO.CategoryBreakdownRow::getTotalAmount)
				.filter(v -> v != null).mapToDouble(v -> v.doubleValue()).sum();

		for (AnnualSummaryReportDTO.CategoryBreakdownRow row : rows) {
			if (row.getTotalAmount() != null && row.getTotalAmount().compareTo(BigDecimal.ZERO) > 0) {

				double pct = (row.getTotalAmount().doubleValue() / total) * 100.0;

				chart.addSeries(row.getCategoryName(), pct);
			}
		}

		if (chart.getSeriesMap().isEmpty()) {
			chart.addSeries("No Data", 1);
		}

		return BitmapEncoder.getBufferedImage(chart);
	}

	private BufferedImage buildMiniCategoryChart(AnnualSummaryReportDTO.CategoryBreakdownRow row) {

		PieChart chart = new PieChartBuilder().width(300).height(300).build();

		chart.getStyler().setLegendVisible(true);
		chart.getStyler().setLegendPosition(Styler.LegendPosition.OutsideS); // bottom legend
		chart.getStyler().setPlotContentSize(0.7); // donut thickness
		chart.getStyler().setCircular(true);
		chart.getStyler().setDefaultSeriesRenderStyle(PieSeries.PieSeriesRenderStyle.Donut);

		chart.getStyler().setChartBackgroundColor(Color.WHITE);
		chart.getStyler().setPlotBackgroundColor(Color.WHITE);
		chart.getStyler().setPlotBorderVisible(false);
		chart.getStyler().setChartFontColor(new Color(60, 60, 60));

		Color[] pastelColors = new Color[] { new Color(158, 203, 208), new Color(255, 183, 178),
				new Color(255, 223, 186), new Color(186, 225, 255), new Color(204, 255, 204) };
		chart.getStyler().setSeriesColors(pastelColors);

		List<AnnualSummaryReportDTO.CategoryItemRow> items = row.getItems() != null ? row.getItems()
				: new ArrayList<>();

		boolean hasNonZero = false;

		for (AnnualSummaryReportDTO.CategoryItemRow item : items) {
			BigDecimal amt = item.getTotalAmount();
			if (amt != null && amt.compareTo(BigDecimal.ZERO) > 0) {
				chart.addSeries(item.getItemName(), amt.doubleValue());
				hasNonZero = true;
			}
		}

		if (!hasNonZero) {
			chart.addSeries("No Data", 1);
		}

		return BitmapEncoder.getBufferedImage(chart);
	}

	@Override
	public BudgetReportResponseDTO generateBudgetReport(FilterRequestDTO req) {
		
		boolean allMonths = req.getMonths().contains("ALL");
		
		List<Budget> budgets = budgetRepo.findBudgets(
	            req.getYear(),
	            req.getMonths(),
	            allMonths
	    );

        List<IncomeRowDTO> incomeRows = new ArrayList<>();
        List<ExpenseRowDTO> expenseRows = new ArrayList<>();
        List<SavingsRowDTO> savingsRows = new ArrayList<>();

        for (Budget b : budgets) {
            for (MonthlyIncome inc : b.getMonthlyIncome()) {
            	IncomeRowDTO income = new IncomeRowDTO();
                income.setActual(inc.getActualIncome());
                income.setIncomeId(inc.getIncomeItem().getIncomeId());
                income.setIncomeName(inc.getIncomeItem().getIncomeName());
                income.setMonth(b.getMonth());
                income.setPlanned(inc.getPlannedIncome());
                incomeRows.add(income);
            }
            for (MonthlyExpense exp : b.getMonthlyExpenses()) {
            	ExpenseRowDTO expense = new ExpenseRowDTO();
                expense.setActual(exp.getActualExpense());
                expense.setCategory(exp.getExpenseItem().getCategory().getCategoryName());
                expense.setExpenseId(exp.getExpenseItem().getExpenseId());
                expense.setItem(exp.getExpenseItem().getExpenseName());
                expense.setMonth(b.getMonth());
                expense.setPlanned(exp.getPlannedExpense());
                expenseRows.add(expense);
            }
            BigDecimal allocatedAmount = allocationRepo.sumAllocatedAmountByBudgetId(b.getBudgetId());
            List<AllocationItemResponseDTO>  allocationList = allocationService.getAllocationsForBudget(b.getBudgetId());
            SavingsRowDTO savings = new SavingsRowDTO();
           
            savings.setMonth(b.getMonth());
            savings.setPlannedSavings(b.getPlannedSavings());
            savings.setTotalSavings(b.getActualSavings());
            savings.setAllocatedAmount(allocatedAmount);
            if (allocatedAmount == null || allocatedAmount.compareTo(BigDecimal.ZERO) == 0) {
            	savings.setAllocationStatus("Not Allocated");
    		} else if (allocatedAmount.compareTo(b.getActualSavings()) != 0) {
    			savings.setAllocationStatus("Needs Reallocation");
    		} else {
    			savings.setAllocationStatus("Allocated");
    		}
            savings.setAllocations(allocationList);
            savingsRows.add(savings);
        }
        return new BudgetReportResponseDTO(incomeRows, expenseRows, savingsRows);
    }

}
