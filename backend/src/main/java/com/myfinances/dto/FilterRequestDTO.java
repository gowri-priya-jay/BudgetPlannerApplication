package com.myfinances.dto;

import java.util.List;

public class FilterRequestDTO {

	private int year;
	
    private List<String> months;

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public List<String> getMonths() {
		return months;
	}

	public void setMonths(List<String> months) {
		this.months = months;
	}
    
}
