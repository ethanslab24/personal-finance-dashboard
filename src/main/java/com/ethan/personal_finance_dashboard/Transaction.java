package com.ethan.personal_finance_dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Transaction {

    private int id;
    private TransactionType type;
    private BigDecimal amount;
    private String category;
    private String description;
    private LocalDate date;

    //getters
    public int getId() {
        return this.id;
    }

    public TransactionType getType() {
        return this.type;
    }

    public BigDecimal amount() {
        return this.amount;
    }

    public String category() {
        return this.category;
    }

    public String description() {
        return this.description;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setTransactionType(TransactionType type) {
        this.type = type;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
