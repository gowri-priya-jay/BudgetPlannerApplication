package com.myfinances.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myfinances.entity.IncomeItem;

public interface IncomeItemRepository extends JpaRepository<IncomeItem, Long> {

	boolean existsByIncomeNameIgnoreCase(String incomeName);

	boolean existsByIncomeNameIgnoreCaseAndIncomeIdNot(String incomeName, Long incomeId);

}
