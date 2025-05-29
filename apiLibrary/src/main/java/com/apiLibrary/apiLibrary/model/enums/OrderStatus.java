package com.apiLibrary.apiLibrary.model.enums;

public enum OrderStatus {
    PENDING,        // Pedido recibido, esperando procesamiento o pago
    PROCESSING,     // Pedido en proceso de preparación
    SHIPPED,        // Pedido enviado
    DELIVERED,      // Pedido entregado
    CANCELLED,      // Pedido cancelado
    REFUNDED        // Pedido devuelto/reembolsado (opcional)
}
