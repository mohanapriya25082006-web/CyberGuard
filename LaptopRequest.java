package com.cyberguard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LaptopRequest {

    @NotBlank(message = "Laptop name is required")
    private String laptopName;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Device ID is required")
    private String deviceId; // must match the ID configured on the ESP32
}
