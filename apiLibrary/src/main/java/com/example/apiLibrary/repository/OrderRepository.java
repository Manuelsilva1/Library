package com.example.apiLibrary.repository;

import com.example.apiLibrary.model.Order;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends CrudRepository<Order, Long> {
    // Basic CRUD methods are inherited.
    // Custom query methods related to orders can be added here.
    // For example:
    // List<Order> findByCustomerEmail(String customerEmail);
    // List<Order> findByStatus(String status);
}
