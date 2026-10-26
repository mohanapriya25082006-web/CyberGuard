package com.cyberguard.controller;

import com.cyberguard.model.AlertEvent;
import com.cyberguard.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    // Full alert history across all of the logged-in user's laptops (for the dashboard)
    @GetMapping
    public ResponseEntity<List<AlertEvent>> allAlerts(Authentication auth) {
        return ResponseEntity.ok(alertService.getAllAlertsForUser(auth.getName()));
    }

    // Alert history for one specific laptop
    @GetMapping("/laptop/{laptopId}")
    public ResponseEntity<List<AlertEvent>> laptopAlerts(Authentication auth, @PathVariable Long laptopId) {
        return ResponseEntity.ok(alertService.getHistoryForLaptop(auth.getName(), laptopId));
    }
}
