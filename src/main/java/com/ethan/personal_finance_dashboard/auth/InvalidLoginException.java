package com.ethan.personal_finance_dashboard.auth;

public class InvalidLoginException extends RuntimeException {

    public InvalidLoginException() {
        super("Invalid username or password.");
    }
}
