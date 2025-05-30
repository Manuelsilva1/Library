package com.example.apiLibrary.service;

import com.example.apiLibrary.dto.OrderDTO;

public interface EmailService {
    void sendOrderConfirmationEmail(OrderDTO orderDetails);
}
