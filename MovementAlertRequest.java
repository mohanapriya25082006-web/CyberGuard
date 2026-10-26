package com.cyberguard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Payload the ESP32 sends over Wi-Fi (HTTP POST) whenever the
 * accelerometer crosses the movement threshold, or when arm state changes.
 */
@Data
public class MovementAlertRequest {

    @NotBlank(message = "deviceId is required")
    private String deviceId;

    @NotBlank(message = "eventType is required")
    private String eventType; // MOVEMENT_DETECTED | ARMED | DISARMED | DEVICE_OFFLINE

    private Double movementValue; // e.g. acceleration delta in g

    @NotBlank(message = "apiKey is required")
    private String apiKey;
}
