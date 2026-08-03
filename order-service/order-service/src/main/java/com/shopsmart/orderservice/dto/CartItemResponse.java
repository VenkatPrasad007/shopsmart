package com.shopsmart.orderservice.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}