package com.cyberguard.service;

import com.cyberguard.dto.MovementAlertRequest;
import com.cyberguard.model.AlertEvent;
import com.cyberguard.model.Laptop;
import com.cyberguard.model.User;
import com.cyberguard.repository.AlertEventRepository;
import com.cyberguard.repository.LaptopRepository;
import com.cyberguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertEventRepository alertEventRepository;
    private final LaptopRepository laptopRepository;
    private final UserRepository userRepository;

    @Value("${device.api.key}")
    private String deviceApiKey;

    /**
     * Called from the ESP32 device over Wi-Fi. Only raises a real
     * MOVEMENT_DETECTED alert when the laptop is currently ARMED,
     * so normal use while DISARMED does not spam the owner.
     */
    public AlertEvent handleDeviceEvent(MovementAlertRequest request) {
        if (!deviceApiKey.equals(request.getApiKey())) {
            throw new SecurityException("Invalid device API key");
        }

        Laptop laptop = laptopRepository.findByDeviceId(request.getDeviceId())
                .orElseThrow(() -> new IllegalArgumentException("Unknown device ID"));

        AlertEvent.AlertType type = AlertEvent.AlertType.valueOf(request.getEventType());

        // Ignore movement pings while disarmed — owner is actively using the laptop
        if (type == AlertEvent.AlertType.MOVEMENT_DETECTED
                && laptop.getArmStatus() != Laptop.ArmStatus.ARMED) {
            return null;
        }

        AlertEvent event = new AlertEvent();
        event.setLaptop(laptop);
        event.setAlertType(type);
        event.setMovementValue(request.getMovementValue());
        event.setMessage(buildMessage(type, laptop.getLaptopName()));

        return alertEventRepository.save(event);
    }

    public List<AlertEvent> getHistoryForLaptop(String ownerEmail, Long laptopId) {
        Laptop laptop = laptopRepository.findById(laptopId)
                .orElseThrow(() -> new IllegalArgumentException("Laptop not found"));

        if (!laptop.getOwner().getEmail().equals(ownerEmail)) {
            throw new SecurityException("You do not own this laptop");
        }

        return alertEventRepository.findByLaptopOrderByTimestampDesc(laptop);
    }

    public List<AlertEvent> getAllAlertsForUser(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Long> laptopIds = laptopRepository.findByOwner(owner).stream()
                .map(Laptop::getId)
                .collect(Collectors.toList());

        return alertEventRepository.findByLaptopIdInOrderByTimestampDesc(laptopIds);
    }

    private String buildMessage(AlertEvent.AlertType type, String laptopName) {
        return switch (type) {
            case MOVEMENT_DETECTED -> "Unauthorized movement detected on \"" + laptopName + "\"!";
            case ARMED -> "\"" + laptopName + "\" is now ARMED and being monitored.";
            case DISARMED -> "\"" + laptopName + "\" is now DISARMED.";
            case DEVICE_OFFLINE -> "\"" + laptopName + "\" device went offline.";
        };
    }
}
