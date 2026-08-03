package com.shopsmart.orderservice.controller;

import com.shopsmart.orderservice.dto.*;
import com.shopsmart.orderservice.entity.OrderStatus;
import com.shopsmart.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Gateway passes user email in this header after JWT validation
    private String getUserEmail(String header) {
        if (header == null || header.isBlank()) {
            throw new RuntimeException("User not authenticated");
        }
        return header;
    }

    // ─── Cart Endpoints ────────────────────────────────────

    @PostMapping("/cart")
    public ResponseEntity<CartItemResponse> addToCart(
            @RequestHeader("X-User-Email") String userEmail,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.addToCart(getUserEmail(userEmail), request));
    }

    @GetMapping("/cart")
    public ResponseEntity<List<CartItemResponse>> getCart(
            @RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.ok(orderService.getCart(getUserEmail(userEmail)));
    }

    @DeleteMapping("/cart/{itemId}")
    public ResponseEntity<Void> removeFromCart(
            @RequestHeader("X-User-Email") String userEmail,
            @PathVariable Long itemId) {
        orderService.removeFromCart(getUserEmail(userEmail), itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/cart")
    public ResponseEntity<Void> clearCart(
            @RequestHeader("X-User-Email") String userEmail) {
        orderService.clearCart(getUserEmail(userEmail));
        return ResponseEntity.noContent().build();
    }

    // ─── Checkout ──────────────────────────────────────────

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @RequestHeader("X-User-Email") String userEmail,
            @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.checkout(getUserEmail(userEmail), request));
    }

    // ─── Order Endpoints ───────────────────────────────────

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.ok(orderService.getMyOrders(getUserEmail(userEmail)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @RequestHeader("X-User-Email") String userEmail,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(getUserEmail(userEmail), id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}