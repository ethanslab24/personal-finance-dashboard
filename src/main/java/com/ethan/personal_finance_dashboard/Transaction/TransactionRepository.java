package com.ethan.personal_finance_dashboard.transaction;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findTop5ByOrderByDateDescIdDesc();

    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
