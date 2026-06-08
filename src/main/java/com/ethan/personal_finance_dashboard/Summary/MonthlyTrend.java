package com.ethan.personal_finance_dashboard.summary;

import java.math.BigDecimal;
import java.time.YearMonth;

public class MonthlyTrend {

    private YearMonth month;
    private BigDecimal income;
    private BigDecimal expenses;
    private BigDecimal balance;

    public MonthlyTrend(YearMonth month, BigDecimal income, BigDecimal expenses, BigDecimal balance) {
        this.month = month;
        this.income = income;
        this.expenses = expenses;
        this.balance = balance;
    }

    public BigDecimal getBalance() {
        return this.balance;
    }

    public BigDecimal getIncome() {
        return this.income;
    }

    public BigDecimal getExpenses() {
        return this.expenses;
    }

    public YearMonth getMonth() {
        return this.month;
    }
}
