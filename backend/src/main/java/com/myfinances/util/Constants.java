package com.myfinances.util;

public class Constants {
	
	//constant strings
	public static final String SEVERITY = "severity";
	public static final String MESSAGE = "message";
	public static final String TOKEN = "token";
	public static final String USERNAME = "username";
	public static final String fullname = "fullname";
	
	//messages for login
	public static final String LOGIN_SUCCESS = "Login Successful";
	public static final String LOGIN_FAILURE = "Invalid credentials";
	//messages for registering user
	public static final String REGISTRATION_SUCCESS = "Registration Successful";
	public static final String BAD_REQUEST = "Bad Request";
	public static final String USERNAME_EXISTS = "Username already exists";
	public static final String UNKNOWN_ERROR = "Unknown error occurred";
	
	//Constants for Expense Category 
	public static final String CATEGORY_DUPLICATE_MESSAGE = "Expense Category name already exists";
	public static final String CATEGORY_NOT_FOUND_MESSSAGE = "Expense Category not found";
	public static final String CATEGORY_DELETE_MESSAGE = "Expense Category Deleted Successfully";
	
	//Constants for Income Items
	public static final String INCOME_DUPLICATE_MESSAGE = "Income name already exists";
	public static final String INCOME_NOT_FOUND_MESSAGE = "Income Item not found";
	public static final String INCOME_DELETE_MESSAGE = "Income Item Deleted Successfully";
	
	//Constants for Expense Items
	public static final String EXPENSE_DUPLICATE_MESSAGE = "Expense name already exists";
	public static final String EXPENSE_NOT_FOUND_MESSAGE = "Expense Item not found" ;
	public static final String EXPENSE_DELETE_MESSAGE = "Expense Item Deleted Successfully";
	
	//Constants for Goal
	public static final String GOAL_DUPLICATE_MESSAGE = "Goal name already exists";
	public static final String GOAL_NOT_FOUND_MESSAGE = "Goal not found";
	public static final String GOAL_DELETE_MESSAGE = "Goal deleted successfully";
	
	//Constants for Account
	public static final String ACCOUNT_NOT_FOUND_MESSAGE = "Account not found";
	
	//Constants for Budget
	public static final String BUDGET_DUPLICATE_MESSAGE = "Budget already exists for this month and year and account";
	public static final String BUDGET_NOT_FOUND = "Budget not found";
	
}
