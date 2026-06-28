package com.ethan.personal_finance_dashboard.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(Long id, TransactionType type, BigDecimal amount, String category, String description, LocalDate date) {

}
