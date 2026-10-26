package com.cyberguard.controller;

import com.cyberguard.model.AlertEvent;
import com.cyberguard.model.Laptop;
import com.cyberguard.service.AlertService;
import com.cyberguard.service.LaptopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final LaptopService laptopService;
    private final AlertService alertService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary(Authentication auth) {
        String email = auth.getName();

        List<Laptop> laptops = laptopService.getLaptopsForUser(email);
        List<AlertEvent> alerts = alertService.getAllAlertsForUser(email);

        long armedCount = laptops.stream()
                .filter(l -> l.getArmStatus() == Laptop.ArmStatus.ARMED)
                .count();

        long theftAlertCount = alerts.stream()
                .filter(a -> a.getAlertType() == AlertEvent.AlertType.MOVEMENT_DETECTED)
                .count();

        Map<String, Object> summary = Map.of(
                "totalLaptops", laptops.size(),
                "armedLaptops", armedCount,
                "totalAlerts", alerts.size(),
                "movementAlerts", theftAlertCount,
                "recentAlerts", alerts.stream().limit(5).toList()
        );

        return ResponseEntity.ok(summary);
    }
}
