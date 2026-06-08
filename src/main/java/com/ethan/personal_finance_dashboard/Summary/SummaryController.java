package com.ethan.personal_finance_dashboard.summary;

import com.ethan.personal_finance_dashboard.transaction.TransactionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.math.BigDecimal;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/summary")
public class SummaryController{

    private final TransactionService transactionService;

    public SummaryController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/balance")
    public BigDecimal getBalance() {
        return transactionService.getBalance();
    }

}