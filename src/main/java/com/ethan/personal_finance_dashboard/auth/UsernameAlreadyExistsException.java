package com.ethan.personal_finance_dashboard.auth;

public class UsernameAlreadyExistsException extends RuntimeException {

    public UsernameAlreadyExistsException() {
        super("Username already exists.");
    }
}
