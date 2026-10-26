package com.cyberguard.repository;

import com.cyberguard.model.Laptop;
import com.cyberguard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LaptopRepository extends JpaRepository<Laptop, Long> {
    List<Laptop> findByOwner(User owner);
    Optional<Laptop> findByDeviceId(String deviceId);
    boolean existsByDeviceId(String deviceId);
}
