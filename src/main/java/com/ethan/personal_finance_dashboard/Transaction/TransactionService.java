package com.ethan.personal_finance_dashboard.transaction;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public BigDecimal getBalance() {
        List<Transaction> transactions = transactionRepository.findAll();

        BigDecimal curBalance = BigDecimal.ZERO;

        for (Transaction t : transactions) {
            if (t.getType() == TransactionType.INCOME) {
                curBalance = curBalance.add(t.getAmount());
            }
            if (t.getType() == TransactionType.EXPENSE) {
                curBalance = curBalance.subtract(t.getAmount());
            }

        }
        return curBalance;
    }

}
