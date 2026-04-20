package com.myfinances.dto;

import java.util.List;
import java.util.Map;

public class ReportResponseDTO {

	private List<String> columns;
	
    private List<List<Object>> rows;
    
    private Map<String, Object> totals;

	public ReportResponseDTO(List<String> columns,
                          List<List<Object>> rows,
                          Map<String, Object> totals) {
        this.columns = columns;
        this.rows = rows;
        this.totals = totals;
    }

	public List<String> getColumns() {
		return columns;
	}

	public void setColumns(List<String> columns) {
		this.columns = columns;
	}

	public List<List<Object>> getRows() {
		return rows;
	}

	public void setRows(List<List<Object>> rows) {
		this.rows = rows;
	}

	public Map<String, Object> getTotals() {
		return totals;
	}

	public void setTotals(Map<String, Object> totals) {
		this.totals = totals;
	}
    
}
