package com.ethan.personal_finance_dashboard.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

    public List<Transaction> getRecentTransactions() {
        return transactionRepository.findTop5ByOrderByDateDescIdDesc();
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

    public List<Transaction> getFilteredTransactions(TransactionType type, String category, String sortBy, String direction, String startDate, String endDate) {

        Specification<Transaction> spec = (root, query, cb) -> cb.conjunction();

        boolean hasCategory = category != null && !category.isBlank();
        boolean hasStartDate = startDate != null && !startDate.isBlank();
        boolean hasEndDate = endDate != null && !endDate.isBlank();

        if (type != null) {
            spec = spec.and((root, query, cb)
                    -> cb.equal(root.get("type"), type)
            );
        }

        if (hasCategory) {
            spec = spec.and((root, query, cb)
                    -> cb.equal(root.get("category"), category)
            );
        }

        if (hasStartDate && hasEndDate) {
            LocalDate startD = LocalDate.parse(startDate);
            LocalDate endD = LocalDate.parse(endDate);

            spec = spec.and((root, query, cb)
                    -> cb.between(root.get("date"), startD, endD)
            );
        } else if (hasStartDate) {
            LocalDate startDateOnly = LocalDate.parse(startDate);

            spec = spec.and((root, query, cb)
                    -> cb.greaterThanOrEqualTo(root.get("date"), startDateOnly));
        }

        String sortField = "date";

        List<String> allowedSortFields = List.of("date", "amount");

        if (sortBy != null && !sortBy.isBlank() && allowedSortFields.contains(sortBy)) {
            sortField = sortBy;
        }

        Sort.Direction sortDirection = Sort.Direction.DESC;

        if ("asc".equalsIgnoreCase(direction)) {
            sortDirection = Sort.Direction.ASC;
        }

        return transactionRepository.findAll(
                spec,
                Sort.by(
                        new Sort.Order(sortDirection, sortField),
                        Sort.Order.desc("id")
                )
        );
    }
}
