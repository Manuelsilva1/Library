package com.apiLibrary.apiLibrary.repository;

import com.apiLibrary.apiLibrary.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Custom query methods can be added here if needed in the future.
}
