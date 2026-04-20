package com.myfinances.dto;

import java.util.List;

public class ActivityResponseDTO {

	private List<ActivityRowDTO> rows;

	public List<ActivityRowDTO> getRows() {
		return rows;
	}

	public void setRows(List<ActivityRowDTO> rows) {
		this.rows = rows;
	}
	
}
