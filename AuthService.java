
package com.cyberguard.service;

import com.cyberguard.dto.AuthResponse;
import com.cyberguard.dto.LoginRequest;
import com.cyberguard.dto.RegisterRequest;
import com.cyberguard.model.User;
import com.cyberguard.repository.UserRepository;
import com.cyberguard.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final GoogleAuthService googleAuthService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getFullName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getFullName(), user.getEmail());
    }

    public AuthResponse loginWithGoogle(String credential) {
        GoogleAuthService.GoogleUser googleUser =
                googleAuthService.verifyCredential(credential);

        User user = userRepository.findByEmail(googleUser.email())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setFullName(googleUser.fullName());
                    newUser.setEmail(googleUser.email());

                    // Store a BCrypt-hashed random password.
                    newUser.setPassword(
                            passwordEncoder.encode(UUID.randomUUID().toString())
                    );

                    return userRepository.save(newUser);
                });

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getFullName(),
                user.getEmail()
        );
    }
}
