package com.ethan.personal_finance_dashboard.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ethan.personal_finance_dashboard.summary.CategorySummary;
import com.ethan.personal_finance_dashboard.summary.FinancialSummary;
import com.ethan.personal_finance_dashboard.summary.MonthlyTrend;

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

    public List<Transaction> getRecentTransactions() {
        return transactionRepository.findTop5ByOrderByDateDescIdDesc();
    }

    public List<Transaction> getTransactionsByMonth(YearMonth ym) {
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();
        return transactionRepository.findByDateBetween(startDate, endDate);
    }

    public List<CategorySummary> getCategorySummary() {
        return transactionRepository.getCategorySummary();
    }

    public List<MonthlyTrend> getMonthlyTrend() {
        List<Object[]> result = transactionRepository.getMonthlyTrendRaw();
        List<MonthlyTrend> monthlyTrends = new ArrayList<>();

        for (Object[] val : result) {
            int year = (Integer) val[0];
            int month = (Integer) val[1];
            YearMonth ym = YearMonth.of(year, month);
            BigDecimal income = (BigDecimal) val[2];
            BigDecimal expenses = (BigDecimal) val[3];
            BigDecimal balance = income.subtract(expenses);
            monthlyTrends.add(new MonthlyTrend(ym, income, expenses, balance));
        }
        return monthlyTrends;
    }
}
