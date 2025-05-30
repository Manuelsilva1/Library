package com.example.apiLibrary.service;

import com.example.apiLibrary.dto.OrderRequestDTO;
import com.example.apiLibrary.dto.OrderResponseDTO;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO orderRequest);
}
