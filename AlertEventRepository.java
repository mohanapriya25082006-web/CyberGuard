package com.cyberguard.repository;

import com.cyberguard.model.AlertEvent;
import com.cyberguard.model.Laptop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertEventRepository extends JpaRepository<AlertEvent, Long> {
    List<AlertEvent> findByLaptopOrderByTimestampDesc(Laptop laptop);
    List<AlertEvent> findTop20ByOrderByTimestampDesc();
    List<AlertEvent> findByLaptopIdInOrderByTimestampDesc(List<Long> laptopIds);
}
