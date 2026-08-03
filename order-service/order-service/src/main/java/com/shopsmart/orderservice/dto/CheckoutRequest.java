package com.shopsmart.orderservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
public class CheckoutRequest {

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
}