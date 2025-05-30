package com.example.apiLibrary.repository;

import com.example.apiLibrary.model.Sale;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends CrudRepository<Sale, Long> {
    // Basic CRUD methods are inherited.
    // Custom query methods related to sales can be added here.
    // For example:
    // List<Sale> findBySellerId(Long sellerId);
    // List<Sale> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
}
