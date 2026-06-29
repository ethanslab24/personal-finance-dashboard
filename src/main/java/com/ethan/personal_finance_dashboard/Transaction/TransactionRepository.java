package com.ethan.personal_finance_dashboard.transaction;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ethan.personal_finance_dashboard.summary.CategorySummary;
import com.ethan.personal_finance_dashboard.user.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>,
        JpaSpecificationExecutor<Transaction> {

    List<Transaction> findTop5ByUserOrderByDateDescIdDesc(User user);

    Optional<Transaction> findByIdAndUser(Long id, User user);

    List<Transaction> findByUser(User user);

    @Query("""
    SELECT new com.ethan.personal_finance_dashboard.summary.CategorySummary(
        t.category,
        SUM(t.amount),
        COUNT(t)
    )
    FROM Transaction t
    WHERE t.type = com.ethan.personal_finance_dashboard.transaction.TransactionType.EXPENSE
    AND t.user = :user
    GROUP BY t.category
""")
    List<CategorySummary> getCategorySummary(@Param("user") User user);

    @Query("""
    SELECT YEAR(t.date),
           MONTH(t.date),
           SUM(CASE WHEN t.type = com.ethan.personal_finance_dashboard.transaction.TransactionType.INCOME THEN t.amount ELSE 0 END),
           SUM(CASE WHEN t.type = com.ethan.personal_finance_dashboard.transaction.TransactionType.EXPENSE THEN t.amount ELSE 0 END)
    FROM Transaction t
    WHERE t.user = :user
    GROUP BY YEAR(t.date), MONTH(t.date)
    ORDER BY YEAR(t.date), MONTH(t.date)
""")
    List<Object[]> getMonthlyTrendRaw(@Param("user") User user);
}
