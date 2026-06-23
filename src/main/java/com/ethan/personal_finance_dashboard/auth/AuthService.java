package com.ethan.personal_finance_dashboard.auth;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ethan.personal_finance_dashboard.user.User;
import com.ethan.personal_finance_dashboard.user.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponse register(RegisterRequest request) {
        boolean usernameExists
                = userRepository.findByUsername(
                        request.getUsername()
                ).isPresent();

        boolean emailExists
                = userRepository.findByEmail(
                        request.getEmail()
                ).isPresent();

        if (usernameExists) {
            throw new UsernameAlreadyExistsException();
        }
        if (emailExists) {
            throw new EmailAlreadyExistsException();
        }

        String hashedPassword
                = passwordEncoder.encode(
                        request.getPassword()
                );

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);

        User savedUser = userRepository.save(user);

        return new RegisterResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
    }

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOptional
                = userRepository.findByUsername(
                        request.getUsername()
                );

        if (userOptional.isEmpty()) {
            throw new InvalidLoginException();
        }

        User user = userOptional.get();

        String storedHash = user.getPassword();
        String rawPassword = request.getPassword();

        boolean passwordMatches
                = passwordEncoder.matches(
                        rawPassword,
                        storedHash
                );

        if (!passwordMatches) {
            throw new InvalidLoginException();
        }

        return new LoginResponse(user.getId(), user.getUsername());
    }
}
