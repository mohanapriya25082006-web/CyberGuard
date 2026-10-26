
package com.cyberguard.controller;

import com.cyberguard.dto.AuthResponse;
import com.cyberguard.dto.GoogleLoginRequest;
import com.cyberguard.dto.LoginRequest;
import com.cyberguard.dto.RegisterRequest;
import com.cyberguard.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(
                authService.loginWithGoogle(request.getCredential())
        );
    }
}
