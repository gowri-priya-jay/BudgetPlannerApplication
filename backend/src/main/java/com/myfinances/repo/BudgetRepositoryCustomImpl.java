package com.myfinances.repo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.myfinances.entity.Budget;
import com.myfinances.entity.ExpenseCategory;
import com.myfinances.entity.ExpenseItem;
import com.myfinances.entity.MonthlyExpense;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Repository
public class BudgetRepositoryCustomImpl implements BudgetRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Budget> findByFilters(
            Integer year,
            String month,
            Long expenseCategoryId,
            Long expenseItemId,
            Long goalId,
            String sortBy,
            String sortOrder) {

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Budget> cq = cb.createQuery(Budget.class);
        Root<Budget> root = cq.from(Budget.class);

        List<Predicate> predicates = new ArrayList<>();

        Join<Budget, MonthlyExpense> monthlyJoin = root.join("monthlyExpenses", JoinType.LEFT);

        Join<MonthlyExpense, ExpenseItem> itemJoin = monthlyJoin.join("expenseItem", JoinType.LEFT);

        Join<ExpenseItem, ExpenseCategory> categoryJoin = itemJoin.join("category", JoinType.LEFT);

        if (year != null) {
            predicates.add(cb.equal(root.get("year"), year));
        }

        if (month != null && !"ALL".equalsIgnoreCase(month)) {
            predicates.add(cb.equal(root.get("month"), month));
        }
        
        if (expenseCategoryId != null) {
            predicates.add(cb.equal(categoryJoin.get("categoryId"), expenseCategoryId));
        }

        if (expenseItemId != null) {
            predicates.add(cb.equal(itemJoin.get("expenseId"), expenseItemId));
        }

        cq.where(predicates.toArray(new Predicate[0]));

        return em.createQuery(cq).getResultList();
    }
 
}