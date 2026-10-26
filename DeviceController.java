package com.cyberguard.controller;

import com.cyberguard.dto.MovementAlertRequest;
import com.cyberguard.model.AlertEvent;
import com.cyberguard.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoint the ESP32 firmware calls directly (no JWT — it authenticates
 * with the shared device.api.key instead, since a microcontroller
 * cannot hold a user login session). Kept public in SecurityConfig.
 */
@RestController
@RequestMapping("/api/device")
@RequiredArgsConstructor
public class DeviceController {

    private final AlertService alertService;

    @PostMapping("/event")
    public ResponseEntity<?> reportEvent(@Valid @RequestBody MovementAlertRequest request) {
        AlertEvent event = alertService.handleDeviceEvent(request);

        if (event == null) {
            // Movement ignored because laptop is currently disarmed
            return ResponseEntity.ok().body("Ignored: laptop disarmed");
        }
        return ResponseEntity.ok(event);
    }
}
