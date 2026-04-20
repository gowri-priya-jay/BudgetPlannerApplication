package com.myfinances.util;

import java.awt.Color;

import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPTableEvent;

public class TwoToneCardEvent implements PdfPTableEvent {

	private final Color leftColor;
    private final Color rightColor;
    private final float radius;
    private final float leftRatio;

    public TwoToneCardEvent(Color leftColor, Color rightColor, float radius, float leftRatio) {
        this.leftColor = leftColor;
        this.rightColor = rightColor;
        this.radius = radius;
        this.leftRatio = leftRatio;
    }

    @Override
    public void tableLayout(PdfPTable table, float[][] widths, float[] heights,
                            int headerRows, int rowStart, PdfContentByte[] canvas) {

        PdfContentByte cb = canvas[PdfPTable.BACKGROUNDCANVAS];

        float left = widths[0][0];
        float right = widths[0][widths[0].length - 1];
        float bottom = heights[heights.length - 1];
        float top = heights[0];

        float width = right - left;
        float height = top - bottom;

        float splitX = left + (width * leftRatio);

        // 1️⃣ Draw the full rounded rectangle
        cb.saveState();
        cb.roundRectangle(left, bottom, width, height, radius);
        cb.clip();
        cb.newPath();

        // 2️⃣ Fill left side
        cb.setColorFill(leftColor);
        cb.rectangle(left, bottom, width * leftRatio, height);
        cb.fill();

        // 3️⃣ Fill right side
        cb.setColorFill(rightColor);
        cb.rectangle(splitX, bottom, width * (1 - leftRatio), height);
        cb.fill();

        cb.restoreState();
    }
}