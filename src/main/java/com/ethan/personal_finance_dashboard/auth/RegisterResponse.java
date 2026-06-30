package com.ethan.personal_finance_dashboard.auth;

public record RegisterResponse(String token, Long id, String username, String email) {

}
