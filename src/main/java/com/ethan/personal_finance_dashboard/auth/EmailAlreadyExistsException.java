package com.ethan.personal_finance_dashboard.auth;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException() {
        super("Email already exists.");
    }
}
