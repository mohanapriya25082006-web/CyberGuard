package com.cyberguard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "laptops")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Laptop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 100)
    private String laptopName;

    @Column(nullable = false, length = 100)
    private String brand;

    // Unique code burned into / configured on the ESP32 device for this laptop
    @Column(nullable = false, unique = true, length = 50)
    private String deviceId;

    // ARMED = alerts active, DISARMED = owner is using it, monitoring paused
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArmStatus armStatus = ArmStatus.DISARMED;

    @Column(updatable = false)
    private LocalDateTime registeredAt;

    @PrePersist
    protected void onCreate() {
        this.registeredAt = LocalDateTime.now();
    }

    public enum ArmStatus {
        ARMED, DISARMED
    }
}
