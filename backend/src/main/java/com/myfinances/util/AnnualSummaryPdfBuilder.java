package com.myfinances.util;

import org.springframework.stereotype.Component;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.myfinances.dto.AnnualSummaryPdfRequestDTO;
import com.myfinances.dto.AnnualSummaryReportDTO;
import com.myfinances.dto.AnnualSummaryReportDTO.CategoryBreakdownRow;
import com.myfinances.dto.AnnualSummaryReportDTO.CategoryItemRow;
import com.myfinances.dto.AnnualSummaryReportDTO.MonthlyOverviewRow;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Base64;
import java.util.Locale;

@Component
public class AnnualSummaryPdfBuilder {
	
	public static Font titleFont = new Font(Font.TIMES_ROMAN, 24, Font.BOLD, new Color(55, 84, 98));
	public static Font yearFont = new Font(Font.TIMES_ROMAN, 20, Font.BOLD, new Color(80, 100, 120));
	public static Font subtitleFont = new Font(Font.TIMES_ROMAN, 14, Font.BOLD, new Color(118, 172, 196));
	public static Font labelFont = new Font(Font.TIMES_ROMAN, 11, Font.BOLD, new Color(60, 60, 60));
	public static Font valueFont = new Font(Font.TIMES_ROMAN, 12, Font.NORMAL, new Color(30, 30, 30));
	public static Font tableTitle = new Font(Font.TIMES_ROMAN,12,Font.BOLD,new Color(255, 255, 255));
	public static Font tableSubtitleFont = new Font(Font.TIMES_ROMAN, 11, Font.BOLD, new Color(30, 30, 30));
	public static Font tableValue = new Font(Font.TIMES_ROMAN, 11, Font.NORMAL, new Color(30, 30, 30));
	
	public static byte[] build(AnnualSummaryReportDTO dto, AnnualSummaryPdfRequestDTO req) {
    	
	    try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

	        Document document = new Document(PageSize.A4, 20, 20, 20, 20);
	        PdfWriter.getInstance(document, out);
	        document.open();

	        // TITLE
	        Paragraph title = new Paragraph("Annual Summary Report", titleFont);
	        title.setAlignment(Element.ALIGN_CENTER);
	        title.setSpacingAfter(5);
	        document.add(title);
	        
	        //Year
	        Paragraph yearPara = new Paragraph(String.valueOf(dto.getYear()), yearFont);
	        yearPara.setAlignment(Element.ALIGN_CENTER);
	        yearPara.setSpacingAfter(10);
	        document.add(yearPara);

	        document.add(new LineSeparator());

	        // OVERVIEW title
	        Paragraph overviewHeader = new Paragraph("Overview", subtitleFont);
	        overviewHeader.setSpacingAfter(5);
	        document.add(overviewHeader);

	        //Three column layout
	        PdfPTable threeCol = new PdfPTable(3);
	        threeCol.setWidthPercentage(100);
	        threeCol.setSpacingBefore(5);
	        threeCol.setSpacingAfter(5);
	        
	     // Income
	        PdfPCell incomeCell = new PdfPCell();
	        incomeCell.addElement(buildMiniTable("INCOME", formatMoney(dto.getTotalIncome())));
	        incomeCell.setBorder(Rectangle.NO_BORDER);
	        threeCol.addCell(incomeCell);

	        // Expense
	        PdfPCell expenseCell = new PdfPCell();
	        expenseCell.addElement(buildMiniTable("EXPENSE", formatMoney(dto.getTotalExpense())));
	        expenseCell.setBorder(Rectangle.NO_BORDER);
	        threeCol.addCell(expenseCell);

	        // Savings
	        PdfPCell savingsCell = new PdfPCell();
	        savingsCell.addElement(buildMiniTable("SAVINGS", formatMoney(dto.getTotalSavings())));
	        savingsCell.setBorder(Rectangle.NO_BORDER);
	        threeCol.addCell(savingsCell);

	        document.add(threeCol);
	        
	        //Monthly Overview title
	        Paragraph monthlyOverviewHeader = new Paragraph("Monthly Overview", subtitleFont);
	        monthlyOverviewHeader.setSpacingAfter(5);
	        monthlyOverviewHeader.setSpacingAfter(5);
	        document.add(monthlyOverviewHeader);
	        
	        //Monthly Overview Table
	        PdfPTable monthlyTable = new PdfPTable(4);
	        monthlyTable.setWidthPercentage(100);
	        monthlyTable.setSpacingBefore(5);
	        monthlyTable.setSpacingAfter(5);
	        monthlyTable.setWidths(new float[]{2f, 2f, 2f, 2f});

	        // Add headers
	        addHeaderCell(monthlyTable, "MONTH");
	        addHeaderCell(monthlyTable, "INCOME");
	        addHeaderCell(monthlyTable, "EXPENSE");
	        addHeaderCell(monthlyTable, "SAVINGS");
	        
	        // monthly values
	        for (MonthlyOverviewRow row : dto.getMonthlyOverview()) {
	            PdfPCell monthCell = new PdfPCell(new Phrase(row.getMonth(), tableSubtitleFont));
	            monthCell.setBackgroundColor(new Color(230, 240, 245));
	            monthCell.setPadding(6);
	            monthCell.setBorderColor(new Color(55, 84, 98));
	            monthCell.setBorderWidth(1f);
	            monthlyTable.addCell(monthCell);

	            // Income
	            PdfPCell iCell = new PdfPCell(new Phrase(formatMoney(row.getActualIncome()), tableValue));
	            iCell.setPadding(6);
	            iCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
	            iCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
	            iCell.setBorderColor(new Color(55, 84, 98));
	            iCell.setBorderWidth(1f);
	            monthlyTable.addCell(iCell);

	            // Expense
	            PdfPCell eCell = new PdfPCell(new Phrase(formatMoney(row.getActualExpense()), tableValue));
	            eCell.setPadding(6);
	            eCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
	            eCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
	            eCell.setBorderColor(new Color(55, 84, 98));
	            eCell.setBorderWidth(1f);
	            monthlyTable.addCell(eCell);

	            // Savings
	            PdfPCell sCell = new PdfPCell(new Phrase(formatMoney(row.getActualSavings()), tableValue));
	            sCell.setPadding(6);
	            sCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
	            sCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
	            sCell.setBorderColor(new Color(55, 84, 98));
	            sCell.setBorderWidth(1f);
	            monthlyTable.addCell(sCell);
	        }
	        document.add(monthlyTable);
	        
	        //Chart header
	        Paragraph trendHeader = new Paragraph("Monthly Trend Chart", subtitleFont);
	        trendHeader.setSpacingBefore(5);
	        trendHeader.setSpacingAfter(5);
	        document.add(trendHeader);
	        
	        //chart image
	        byte[] trendBytes = Base64.getDecoder().decode(req.getTrendChart().split(",")[1]);
	    	Image trendImg = Image.getInstance(trendBytes);
	    	trendImg.scaleToFit(500, 250);
	    	document.add(trendImg);
	    	
	    	//Expenses Breakdown By Category
	    	 Paragraph catHeader = new Paragraph("Expense Breakdown By Category", subtitleFont);
		     catHeader.setSpacingBefore(5);
		     catHeader.setSpacingAfter(5);
		     document.add(catHeader);
		     
		     for(CategoryBreakdownRow row : dto.getCategoryBreakdown()) {
		    	 PdfPTable card = createTwoToneCard(new Color(250, 245, 240),new Color(219, 219, 219),"Category : "+row.getCategoryName().toUpperCase(),formatMoney(row.getTotalAmount()));
		    	 card.setHorizontalAlignment(Element.ALIGN_LEFT);
		    	 document.add(card);
		    	 PdfPTable table = new PdfPTable(2);
		 	     table.setWidthPercentage(50);
		 	     table.setSpacingBefore(5);
		 	     table.setSpacingAfter(5);
		 	     table.setHorizontalAlignment(Element.ALIGN_LEFT);
		 	     table.setWidths(new float[]{2f, 2f});
		    	 
		 	     PdfPCell titleCell = new PdfPCell(new Phrase("EXPENSE ITEM", tableTitle));
			     titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
			     titleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
			     titleCell.setPadding(6);
			     titleCell.setBackgroundColor(new Color(105, 147, 156));
			     titleCell.setBorder(Rectangle.BOX);
			     titleCell.setBorderColor(new Color(105, 147, 156));
			     
			     PdfPCell titleCell2 = new PdfPCell(new Phrase("AMOUNT", tableTitle));
			     titleCell2.setHorizontalAlignment(Element.ALIGN_CENTER);
			     titleCell2.setVerticalAlignment(Element.ALIGN_MIDDLE);
			     titleCell2.setPadding(6);
			     titleCell2.setBackgroundColor(new Color(105, 147, 156));
			     titleCell2.setBorder(Rectangle.BOX);
			     titleCell2.setBorderColor(new Color(105, 147, 156));
			     
			     table.addCell(titleCell);
			     table.addCell(titleCell2);
			     
			     //table content
			     for(CategoryItemRow item : row.getItems()) {
			    	PdfPCell valueCell1 = new PdfPCell(new Phrase(item.getItemName(), valueFont));
			    	valueCell1.setHorizontalAlignment(Element.ALIGN_LEFT);
			    	valueCell1.setVerticalAlignment(Element.ALIGN_MIDDLE);
			    	valueCell1.setPadding(5);
			    	valueCell1.setBorder(Rectangle.BOX);
			    	valueCell1.setBorderColor(new Color(105, 147, 156));
			    	PdfPCell valueCell2 = new PdfPCell(new Phrase(formatMoney(item.getTotalAmount()), valueFont));
			    	valueCell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
			    	valueCell2.setVerticalAlignment(Element.ALIGN_MIDDLE);
			    	valueCell2.setPadding(5);
			    	valueCell2.setBorder(Rectangle.BOX);
			    	valueCell2.setBorderColor(new Color(105, 147, 156));
			    	table.addCell(valueCell1);
			    	table.addCell(valueCell2);
			     }
		    	 document.add(table);
		     }
		     
		     Paragraph drillHeader = new Paragraph("Expenses Breakdown", subtitleFont);
		     drillHeader.setSpacingBefore(5);
		     drillHeader.setSpacingAfter(5);
		     document.add(drillHeader);
		     
		     byte[] expenseBytes = Base64.getDecoder().decode(req.getExpenseChart().split(",")[1]);
		     Image expenseImg = Image.getInstance(expenseBytes);
		     expenseImg.scaleToFit(600, 300);
		     expenseImg.setSpacingAfter(5);
		     document.add(expenseImg);
	    	
	        document.newPage();
	        
	        // =========================
	        // MONTHLY AVERAGES
	        // =========================
	        Paragraph avgHeader = new Paragraph("Monthly Averages", subtitleFont);
	        avgHeader.setSpacingBefore(5);
	        avgHeader.setSpacingAfter(5);
	        document.add(avgHeader);

	        PdfPTable avgTable = new PdfPTable(2);
	        avgTable.setWidthPercentage(50);
	        avgTable.setSpacingBefore(5);
	        avgTable.setSpacingAfter(5);
	        avgTable.setHorizontalAlignment(Element.ALIGN_LEFT);

	        addHeaderCell(avgTable, "Description");
	        addHeaderCell(avgTable, "Amount");

	        addKeyValueRow(avgTable, "Average Income", formatMoney(dto.getAverageIncome()));
	        addKeyValueRow(avgTable, "Average Expense", formatMoney(dto.getAverageExpense()));
	        addKeyValueRow(avgTable, "Average Savings", formatMoney(dto.getAverageSavings()));

	        document.add(avgTable);
	        
	        // =========================
	        // QUICK STATS
	        // =========================
	        Paragraph quickStatsHeader = new Paragraph("Quick Stats", subtitleFont);
	        quickStatsHeader.setSpacingBefore(5);
	        quickStatsHeader.setSpacingAfter(5);
	        document.add(quickStatsHeader);
	        
	        document.add(createTwoToneCard(new Color(250, 245, 240),new Color(219, 219, 219),"Highest Spending Month : ",dto.getHighestSpendingMonth() ));
	        document.add(createTwoToneCard(new Color(250, 245, 240),new Color(219, 219, 219),"Lowest Spending Month : " ,dto.getLowestSpendingMonth() ));
	        document.add(createTwoToneCard(new Color(250, 245, 240),new Color(219, 219, 219),"Overspent Months : " ,String.valueOf(dto.getOverspentMonthsCount()) ));
	        document.add(createTwoToneCard(new Color(250, 245, 240),new Color(219, 219, 219),"Underspent Months : " ,String.valueOf(dto.getUnderspentMonthsCount()) ));

	        document.close();
	        return out.toByteArray();

	    } catch (Exception e) {
	        throw new RuntimeException("Annual summary PDF generation failed", e);
	    }
	}

	private static void addKeyValueRow(PdfPTable table, String key, Object value) {
		PdfPCell keyCell = new PdfPCell(new Phrase(key));
		keyCell.setBackgroundColor(new Color(245, 247, 248));
		keyCell.setPadding(6);
		keyCell.setHorizontalAlignment(Element.ALIGN_LEFT);
		keyCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
		table.addCell(keyCell);

		PdfPCell valueCell = new PdfPCell(new Phrase(String.valueOf(value)));
		valueCell.setPadding(6);
		valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
		valueCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
		table.addCell(valueCell);
	}

	private static void addHeaderCell(PdfPTable table, String text) {
		PdfPCell headerCell = new PdfPCell(new Phrase(text, tableTitle));
		headerCell.setBackgroundColor(new Color(55, 84, 98));
		headerCell.setBorder(Rectangle.BOX);
		headerCell.setBorderColor(new Color(55, 84, 98));
		headerCell.setPadding(6);
		headerCell.setBorderWidth(1f);
		headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
		headerCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
		table.addCell(headerCell);
	}

	public static String formatMoney(BigDecimal value) {
	    if (value == null) return "$0.00";
	    NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "AU"));
	    return formatter.format(value);
	}
	
	private static PdfPTable buildMiniTable(String title, String value) {
	    PdfPTable table = new PdfPTable(1);
	    table.setWidthPercentage(100);

	    PdfPCell titleCell = new PdfPCell(new Phrase(title, tableTitle));
	    titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
	    titleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
	    titleCell.setPadding(6);
	    titleCell.setBackgroundColor(new Color(105, 147, 156));
	    titleCell.setBorder(Rectangle.BOX);
	    titleCell.setBorderColor(new Color(105, 147, 156));

	    PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
	    valueCell.setHorizontalAlignment(Element.ALIGN_CENTER);
	    valueCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
	    valueCell.setPadding(6);
	    valueCell.setBorder(Rectangle.BOX);
	    valueCell.setBorderColor(new Color(105, 147, 156));

	    table.addCell(titleCell);
	    table.addCell(valueCell);

	    return table;
	}
	
	private static PdfPTable createTwoToneCard(Color dark,Color light, String leftText, String rightText ) {
		PdfPTable card = new PdfPTable(2);
    	card.setWidthPercentage(75);
    	card.setWidths(new float[]{2.5f, 1.5f});
    	float leftRatio = 2.5f / (2.5f + 1.5f);
    	card.setTableEvent(new TwoToneCardEvent(
    			    dark, 
    			    light,  
    		        5f,                      
    		        leftRatio              
    		));
    	 card.setSpacingBefore(10);
    	 card.setSpacingAfter(10);
    	 card.setHorizontalAlignment(Element.ALIGN_LEFT);

    	 PdfPCell left = new PdfPCell(new Phrase(leftText, new Font(Font.TIMES_ROMAN, 11, Font.BOLD, new Color(0,0,0))));
    	 left.setBorder(Rectangle.NO_BORDER);
    	 left.setPadding(5);
    	 left.setFixedHeight(30f);
    	 left.setVerticalAlignment(Element.ALIGN_MIDDLE);

    	 PdfPCell right = new PdfPCell(new Phrase(rightText, new Font(Font.TIMES_ROMAN, 11, Font.BOLD, new Color(137, 98, 0))));
    	 right.setBorder(Rectangle.NO_BORDER);
    	 right.setPadding(5);
    	 right.setFixedHeight(30f);
    	 right.setHorizontalAlignment(Element.ALIGN_RIGHT);
    	 right.setVerticalAlignment(Element.ALIGN_MIDDLE);
    	 card.addCell(left);
    	 card.addCell(right);
    	 card.setSpacingBefore(5);
    	 card.setSpacingAfter(5);
    	 return card;
	}

}
