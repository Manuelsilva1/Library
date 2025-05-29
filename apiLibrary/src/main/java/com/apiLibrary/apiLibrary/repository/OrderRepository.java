package com.apiLibrary.apiLibrary.repository;

import com.apiLibrary.apiLibrary.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    // Consider adding sorting or pagination if the list can be large
    // Example: List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
}
