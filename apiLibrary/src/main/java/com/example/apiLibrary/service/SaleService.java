package com.example.apiLibrary.service;

import com.example.apiLibrary.dto.SaleRequestDTO;
import com.example.apiLibrary.dto.SaleResponseDTO;

public interface SaleService {
    SaleResponseDTO createSale(SaleRequestDTO saleRequest);
}
