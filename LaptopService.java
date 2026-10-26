package com.cyberguard.service;

import com.cyberguard.dto.LaptopRequest;
import com.cyberguard.model.Laptop;
import com.cyberguard.model.User;
import com.cyberguard.repository.LaptopRepository;
import com.cyberguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LaptopService {

    private final LaptopRepository laptopRepository;
    private final UserRepository userRepository;

    public Laptop registerLaptop(String ownerEmail, LaptopRequest request) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (laptopRepository.existsByDeviceId(request.getDeviceId())) {
            throw new IllegalArgumentException("This device ID is already registered");
        }

        Laptop laptop = new Laptop();
        laptop.setOwner(owner);
        laptop.setLaptopName(request.getLaptopName());
        laptop.setBrand(request.getBrand());
        laptop.setDeviceId(request.getDeviceId());
        laptop.setArmStatus(Laptop.ArmStatus.DISARMED);

        return laptopRepository.save(laptop);
    }

    public List<Laptop> getLaptopsForUser(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return laptopRepository.findByOwner(owner);
    }

    public Laptop setArmStatus(String ownerEmail, Long laptopId, Laptop.ArmStatus status) {
        Laptop laptop = laptopRepository.findById(laptopId)
                .orElseThrow(() -> new IllegalArgumentException("Laptop not found"));

        if (!laptop.getOwner().getEmail().equals(ownerEmail)) {
            throw new SecurityException("You do not own this laptop");
        }

        laptop.setArmStatus(status);
        return laptopRepository.save(laptop);
    }
}
