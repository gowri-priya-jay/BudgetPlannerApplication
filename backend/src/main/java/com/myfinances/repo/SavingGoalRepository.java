package com.myfinances.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myfinances.entity.SavingGoal;

public interface SavingGoalRepository extends JpaRepository<SavingGoal, Long> {

	 boolean existsByGoalName(String goalName);

}
