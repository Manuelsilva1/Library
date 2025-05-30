package com.example.apiLibrary.dto;

import lombok.Data;
// No validation needed here for now, but if bookId or quantity had specific constraints,
// they could be added (e.g. @NotNull, @Min(1) for quantity)
// For this to be triggered by @Valid on a List<OrderItemDTO>, these annotations would be necessary.

@Data
public class OrderItemDTO {
    private Long bookId;
    private Integer quantity;
}
