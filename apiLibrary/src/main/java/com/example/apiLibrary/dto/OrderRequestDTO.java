package com.example.apiLibrary.dto;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
public class OrderRequestDTO {

    @NotBlank(message = "Customer name cannot be blank")
    @Size(min = 2, max = 100, message = "Customer name must be between 2 and 100 characters")
    private String customerName;

    @NotBlank(message = "Customer email cannot be blank")
    @Email(message = "Customer email should be a valid email address")
    private String customerEmail;

    @NotEmpty(message = "Order items cannot be empty")
    @Valid // This will trigger validation for each OrderItemDTO in the list if OrderItemDTO has annotations
    private List<OrderItemDTO> items;
}
