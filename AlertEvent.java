package com.cyberguard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "alert_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "laptop_id", nullable = false)
    private Laptop laptop;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType alertType;

    // Raw accelerometer magnitude / delta reported by ESP32 (helps tune sensitivity later)
    private Double movementValue;

    @Column(length = 255)
    private String message;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private boolean resolved = false;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    public enum AlertType {
        MOVEMENT_DETECTED,
        ARMED,
        DISARMED,
        DEVICE_OFFLINE
    }
}
