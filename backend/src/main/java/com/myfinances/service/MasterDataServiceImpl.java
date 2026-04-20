package com.myfinances.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myfinances.dto.ExpenseCategoryResponseDTO;
import com.myfinances.dto.ExpenseItemResponseDTO;
import com.myfinances.dto.IncomeItemResponseDTO;
import com.myfinances.entity.ExpenseCategory;
import com.myfinances.entity.ExpenseItem;
import com.myfinances.entity.IncomeItem;
import com.myfinances.repo.ExpenseCategoryRepository;
import com.myfinances.repo.ExpenseItemRepository;
import com.myfinances.repo.IncomeItemRepository;
import com.myfinances.util.Constants;

@Service
public class MasterDataServiceImpl implements MasterDataService {

	@Autowired
	IncomeItemRepository incomeItemRepo;

	@Autowired
	ExpenseItemRepository expenseItemRepo;

	@Autowired
	ExpenseCategoryRepository expenseCategoryRepo;

	@Override
	public List<IncomeItemResponseDTO> getIncomeItems() {
		return incomeItemRepo.findAll().stream().map(this::mapIncomeItem).toList();
	}

	@Override
	public List<ExpenseItemResponseDTO> getExpenseItems() {
		return expenseItemRepo.findAll().stream().map(this::mapExpenseItem).toList();
	}

	@Override
	public List<ExpenseCategoryResponseDTO> getExpenseCategories() {
		return expenseCategoryRepo.findAll().stream().map(this::mapExpenseCategory).toList();
	}

	@Override
	public ExpenseCategoryResponseDTO createExpenseCategory(String categoryName) {
		boolean exists = expenseCategoryRepo.existsByCategoryNameIgnoreCase(categoryName);
		if (exists) {
			throw new RuntimeException(Constants.CATEGORY_DUPLICATE_MESSAGE);
		}
		ExpenseCategory category = new ExpenseCategory();
		category.setCategoryName(categoryName);
		category.setCreatedAt(LocalDateTime.now());
		category.setUpdatedAt(LocalDateTime.now());
		category = expenseCategoryRepo.save(category);
		return mapExpenseCategory(category);
	}

	@Override
	public ExpenseCategoryResponseDTO updateExpenseCategory(Long categoryId, String categoryName) {
		ExpenseCategory category = expenseCategoryRepo.findById(categoryId)
				.orElseThrow(() -> new RuntimeException(Constants.CATEGORY_NOT_FOUND_MESSSAGE));
		boolean exists = expenseCategoryRepo.existsByCategoryNameIgnoreCaseAndCategoryIdNot(categoryName, categoryId);
		if (exists) {
			throw new RuntimeException(Constants.CATEGORY_DUPLICATE_MESSAGE);
		}
		category.setCategoryName(categoryName);
		category.setUpdatedAt(LocalDateTime.now());
		category = expenseCategoryRepo.save(category);
		return mapExpenseCategory(category);
	}

	@Override
	public void deleteExpenseCategory(Long categoryId) {
		expenseCategoryRepo.deleteById(categoryId);
	}

	@Override
	public IncomeItemResponseDTO createIncomeItem(String incomeName) {
		boolean exists = incomeItemRepo.existsByIncomeNameIgnoreCase(incomeName);
		if (exists) {
			throw new RuntimeException(Constants.INCOME_DUPLICATE_MESSAGE);
		}
		IncomeItem item = new IncomeItem();
		item.setIncomeName(incomeName);
		item.setCreatedAt(LocalDateTime.now());
		item.setUpdatedAt(LocalDateTime.now());
		item = incomeItemRepo.save(item);
		return mapIncomeItem(item);
	}

	@Override
	public IncomeItemResponseDTO updateIncomeItem(Long incomeId, String incomeName) {
		IncomeItem item = incomeItemRepo.findById(incomeId)
				.orElseThrow(() -> new RuntimeException(Constants.INCOME_NOT_FOUND_MESSAGE));
		boolean exists = incomeItemRepo.existsByIncomeNameIgnoreCaseAndIncomeIdNot(incomeName, incomeId);
		if (exists) {
			throw new RuntimeException(Constants.INCOME_DUPLICATE_MESSAGE);
		}
		item.setIncomeName(incomeName);
		item.setUpdatedAt(LocalDateTime.now());
		item = incomeItemRepo.save(item);
		return mapIncomeItem(item);
	}

	@Override
	public void deleteIncomeItem(Long incomeId) {
		incomeItemRepo.deleteById(incomeId);
	}

	@Override
	public ExpenseItemResponseDTO createExpenseItem(String expenseName, Long categoryId) {
		boolean exists = expenseItemRepo.existsByExpenseNameIgnoreCase(expenseName);
		if (exists) {
			throw new RuntimeException(Constants.EXPENSE_DUPLICATE_MESSAGE);
		}
		ExpenseCategory category = expenseCategoryRepo.findById(categoryId)
				.orElseThrow(() -> new RuntimeException(Constants.EXPENSE_NOT_FOUND_MESSAGE));
		ExpenseItem item = new ExpenseItem();
		item.setExpenseName(expenseName);
		item.setCategory(category);
		item.setCreatedAt(LocalDateTime.now());
		item.setUpdatedAt(LocalDateTime.now());
		item = expenseItemRepo.save(item);
		return mapExpenseItem(item);
	}

	@Override
	public ExpenseItemResponseDTO updateExpenseItem(Long expenseId, String expenseName, Long categoryId) {
		ExpenseItem item = expenseItemRepo.findById(expenseId)
				.orElseThrow(() -> new RuntimeException("Expense Item not found"));
		boolean exists = expenseItemRepo.existsByExpenseNameIgnoreCaseAndExpenseIdNot(expenseName, expenseId);
		if (exists) {
			throw new RuntimeException("Expense name already exists");
		}
		ExpenseCategory category = expenseCategoryRepo.findById(categoryId)
				.orElseThrow(() -> new RuntimeException("Expense category Item not found"));
		item.setExpenseName(expenseName);
		item.setCategory(category);
		item.setUpdatedAt(LocalDateTime.now());
		item = expenseItemRepo.save(item);
		return mapExpenseItem(item);
	}

	@Override
	public void deleteExpenseItem(Long expenseId) {
		expenseItemRepo.deleteById(expenseId);
	}

	// ---------------- MAPPERS ----------------

	private IncomeItemResponseDTO mapIncomeItem(IncomeItem item) {
		IncomeItemResponseDTO dto = new IncomeItemResponseDTO();
		dto.setIncomeId(item.getIncomeId());
		dto.setIncomeName(item.getIncomeName());
		return dto;
	}

	private ExpenseItemResponseDTO mapExpenseItem(ExpenseItem item) {
		ExpenseItemResponseDTO dto = new ExpenseItemResponseDTO();
		dto.setExpenseId(item.getExpenseId());
		dto.setExpenseName(item.getExpenseName());
		dto.setCategoryId(item.getCategory().getCategoryId());
		return dto;
	}

	private ExpenseCategoryResponseDTO mapExpenseCategory(ExpenseCategory cat) {
		ExpenseCategoryResponseDTO dto = new ExpenseCategoryResponseDTO();
		dto.setCategoryId(cat.getCategoryId());
		dto.setCategoryName(cat.getCategoryName());
		return dto;
	}

	@Override
	public List<ExpenseItemResponseDTO> getItemsByCategory(Long categoryId) {
		List<ExpenseItem> list = expenseItemRepo.findByCategory_CategoryId(categoryId);
		return list.stream().map(this::mapExpenseItem).collect(Collectors.toList());
	}

}
