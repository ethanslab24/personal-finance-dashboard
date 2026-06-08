package com.ethan.personal_finance_dashboard.transaction;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ethan.personal_finance_dashboard.summary.CategorySummary;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findTop5ByOrderByDateDescIdDesc();

    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("""
    SELECT new com.ethan.personal_finance_dashboard.summary.CategorySummary(
        t.category,
        SUM(t.amount),
        COUNT(t)
    )
    FROM Transaction t
    GROUP BY t.category
""")
    List<CategorySummary> getCategorySummary();
}
