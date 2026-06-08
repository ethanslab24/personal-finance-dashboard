package com.ethan.personal_finance_dashboard.summary;

import java.math.BigDecimal;

public class CategorySummary {

    private String category;
    private BigDecimal total;
    private Long count;

    public CategorySummary(String category, BigDecimal total, Long count) {
        this.category = category;
        this.total = total;
        this.count = count;
    }

    public String getCategory() {
        return this.category;
    }

    public BigDecimal getTotal() {
        return this.total;
    }

    public Long getCount() {
        return this.count;
    }
}
