package com.apiLibrary.apiLibrary.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDto {

    @NotBlank(message = "Shipping address line 1 is mandatory")
    @Size(max = 255, message = "Shipping address line 1 cannot exceed 255 characters")
    private String shippingAddressLine1;

    @Size(max = 255, message = "Shipping address line 2 cannot exceed 255 characters")
    private String shippingAddressLine2; // Optional

    @NotBlank(message = "Shipping city is mandatory")
    @Size(max = 100, message = "Shipping city cannot exceed 100 characters")
    private String shippingCity;

    @NotBlank(message = "Shipping postal code is mandatory")
    @Size(max = 20, message = "Shipping postal code cannot exceed 20 characters")
    private String shippingPostalCode;

    @NotBlank(message = "Shipping country is mandatory")
    @Size(max = 100, message = "Shipping country cannot exceed 100 characters")
    private String shippingCountry;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid // Ensure nested DTOs are validated
    private List<OrderItemRequestDto> items;
}
