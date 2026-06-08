package com.ethan.personal_finance_dashboard.summary;

import java.math.BigDecimal;

public class FinancialSummary {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal balance;

    public FinancialSummary(BigDecimal balance, BigDecimal totalIncome, BigDecimal totalExpenses) {
        this.balance = balance;
        this.totalExpenses = totalExpenses;
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalIncome() {
        return this.totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return this.totalExpenses;
    }

    public BigDecimal getBalance() {
        return this.balance;
    }
}
