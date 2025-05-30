package com.example.apiLibrary.controller;

import com.example.apiLibrary.dto.SaleRequestDTO;
import com.example.apiLibrary.dto.SaleResponseDTO;
import com.example.apiLibrary.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    @Autowired
    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    public ResponseEntity<SaleResponseDTO> createSale(@Valid @RequestBody SaleRequestDTO saleRequest) {
        SaleResponseDTO saleResponse = saleService.createSale(saleRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(saleResponse);
    }
}
