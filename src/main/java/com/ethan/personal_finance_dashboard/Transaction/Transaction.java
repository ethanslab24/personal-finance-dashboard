package com.ethan.personal_finance_dashboard.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
public class Transaction {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    @NotNull
    @Positive
    @Digits(integer = 10, fraction = 2)
    private BigDecimal amount;
    @NotBlank
    private String category;
    private String description;
    @NotNull
    private LocalDate date;

    //getters
    public Long getId() {
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

    public void setId(Long id) {
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
