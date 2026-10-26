package com.cyberguard.controller;

import com.cyberguard.dto.LaptopRequest;
import com.cyberguard.model.Laptop;
import com.cyberguard.service.LaptopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laptops")
@RequiredArgsConstructor
public class LaptopController {

    private final LaptopService laptopService;

    @PostMapping
    public ResponseEntity<Laptop> registerLaptop(Authentication auth, @Valid @RequestBody LaptopRequest request) {
        String email = auth.getName();
        return ResponseEntity.ok(laptopService.registerLaptop(email, request));
    }

    @GetMapping
    public ResponseEntity<List<Laptop>> myLaptops(Authentication auth) {
        return ResponseEntity.ok(laptopService.getLaptopsForUser(auth.getName()));
    }

    @PutMapping("/{id}/arm")
    public ResponseEntity<Laptop> arm(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(laptopService.setArmStatus(auth.getName(), id, Laptop.ArmStatus.ARMED));
    }

    @PutMapping("/{id}/disarm")
    public ResponseEntity<Laptop> disarm(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(laptopService.setArmStatus(auth.getName(), id, Laptop.ArmStatus.DISARMED));
    }
}
