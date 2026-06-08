package com.ethan.personal_finance_dashboard.transaction;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ethan.personal_finance_dashboard.summary.FinancialSummary;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public FinancialSummary getFinancialSummary() {
        List<Transaction> transactions = transactionRepository.findAll();

        BigDecimal balance = BigDecimal.ZERO;
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;

        for (Transaction t : transactions) {
            if (t.getType() == TransactionType.INCOME) {
                totalIncome = totalIncome.add(t.getAmount());
                balance = balance.add(t.getAmount());
            } else if (t.getType() == TransactionType.EXPENSE) {
                totalExpenses = totalExpenses.add(t.getAmount());
                balance = balance.subtract(t.getAmount());
            }
        }

        return new FinancialSummary(balance, totalIncome, totalExpenses);
    }
}
