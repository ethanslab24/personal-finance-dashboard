package com.ethan.personal_finance_dashboard.transaction;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ethan.personal_finance_dashboard.summary.CategorySummary;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findAllByOrderByDateDescIdDesc();

    List<Transaction> findTop5ByOrderByDateDescIdDesc();

    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<Transaction> findByType(TransactionType type);

    List<Transaction> findByDateBetweenAndType(
            LocalDate startDate,
            LocalDate endDate,
            TransactionType type
    );

    @Query("""
    SELECT new com.ethan.personal_finance_dashboard.summary.CategorySummary(
        t.category,
        SUM(t.amount),
        COUNT(t)
    )
    FROM Transaction t
    WHERE t.type = com.ethan.personal_finance_dashboard.transaction.TransactionType.EXPENSE
    GROUP BY t.category
""")
    List<CategorySummary> getCategorySummary();

    @Query("""
    SELECT YEAR(t.date),
           MONTH(t.date),
           SUM(CASE WHEN t.type = com.ethan.personal_finance_dashboard.transaction.TransactionType.INCOME THEN t.amount ELSE 0 END),
           SUM(CASE WHEN t.type = com.ethan.personal_finance_dashboard.transaction.TransactionType.EXPENSE THEN t.amount ELSE 0 END)
    FROM Transaction t
    GROUP BY YEAR(t.date), MONTH(t.date)
    ORDER BY YEAR(t.date) DESC, MONTH(t.date) DESC
""")
    List<Object[]> getMonthlyTrendRaw();
}
