package com.ethan.personal_finance_dashboard.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ethan.personal_finance_dashboard.summary.CategorySummary;
import com.ethan.personal_finance_dashboard.summary.FinancialSummary;
import com.ethan.personal_finance_dashboard.summary.MonthlyTrend;
import com.ethan.personal_finance_dashboard.user.User;
import com.ethan.personal_finance_dashboard.user.UserRepository;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getCategory(),
                transaction.getDescription(),
                transaction.getDate()
        );
    }

    public TransactionResponse createTransaction(Transaction transaction) {
        String username = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow();

        transaction.setUser(currentUser);

        Transaction savedTransaction = transactionRepository.save(transaction);

        return toResponse(savedTransaction);
    }

    public TransactionResponse editTransactionById(Long id, Transaction t) {
        String username = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow();

        Transaction transactionToEdit = transactionRepository
                .findByIdAndUser(id, currentUser)
                .orElseThrow();

        transactionToEdit.setAmount(t.getAmount());
        transactionToEdit.setCategory(t.getCategory());
        transactionToEdit.setDescription(t.getDescription());

        Transaction savedTransaction = transactionRepository.save(transactionToEdit);

        return toResponse(savedTransaction);
    }

    public void deleteTransactionById(Long id) {
        String username = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow();

        Transaction transactionToDel = transactionRepository
                .findByIdAndUser(id, currentUser)
                .orElseThrow();

        transactionRepository.delete(transactionToDel);
    }

    public List<TransactionResponse> getRecentTransactions() {

        String username = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow();

        List<Transaction> transactions = transactionRepository
                .findTop5ByUserOrderByDateDescIdDesc(currentUser);

        return transactions.stream()
                .map(this::toResponse)
                .toList();
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

    public List<TransactionResponse> getFilteredTransactions(TransactionType type, String category, String sortBy, String direction, String startDate, String endDate) {

        String username = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow();

        Specification<Transaction> spec = (root, query, cb) -> cb.conjunction();

        spec = spec.and((root, query, cb)
                -> cb.equal(root.get("user"), currentUser)
        );

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

        List<Transaction> transactions = transactionRepository.findAll(
                spec,
                Sort.by(
                        new Sort.Order(sortDirection, sortField),
                        Sort.Order.desc("id")
                )
        );

        return transactions.stream()
                .map(this::toResponse)
                .toList();
    }
}
