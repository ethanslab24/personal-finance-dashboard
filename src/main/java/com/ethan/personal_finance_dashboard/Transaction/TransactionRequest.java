package com.ethan.personal_finance_dashboard.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

public class TransactionRequest {

    @NotNull
    private TransactionType type;
    @NotNull
    @Positive
    @Digits(integer = 10, fraction = 2)
    private BigDecimal amount;
    @NotBlank
    private String category;
    private String description;
    @NotNull
    @PastOrPresent
    private LocalDate date;

    public TransactionRequest() {
    }

    public TransactionType getType() {
        return this.type;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public String getCategory() {
        return this.category;
    }

    public String getDescription() {
        return this.description;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public void setType(TransactionType type) {
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
