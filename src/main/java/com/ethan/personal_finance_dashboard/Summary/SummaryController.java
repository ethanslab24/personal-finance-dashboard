package com.ethan.personal_finance_dashboard.summary;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ethan.personal_finance_dashboard.transaction.TransactionService;

@RestController
@RequestMapping("/summary")
public class SummaryController {

    private final TransactionService transactionService;

    public SummaryController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public FinancialSummary summary() {
        return transactionService.getFinancialSummary();
    }

    @GetMapping("/category")
    public List<CategorySummary> categorySummary() {
        return transactionService.getCategorySummary();
    }

    @GetMapping("/monthly-trend")
    public List<MonthlyTrend> monthlyTrends() {
        return transactionService.getMonthlyTrend();
    }
}
