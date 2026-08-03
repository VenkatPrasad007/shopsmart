package com.shopsmart.orderservice.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopsmart.orderservice.dto.AddToCartRequest;
import com.shopsmart.orderservice.dto.CartItemResponse;
import com.shopsmart.orderservice.dto.CheckoutRequest;
import com.shopsmart.orderservice.dto.OrderItemResponse;
import com.shopsmart.orderservice.dto.OrderResponse;
import com.shopsmart.orderservice.entity.CartItem;
import com.shopsmart.orderservice.entity.Order;
import com.shopsmart.orderservice.entity.OrderItem;
import com.shopsmart.orderservice.entity.OrderStatus;
import com.shopsmart.orderservice.repository.CartItemRepository;
import com.shopsmart.orderservice.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;

    // ─── Cart Operations ───────────────────────────────────

    @Transactional
    public CartItemResponse addToCart(String userEmail, AddToCartRequest request) {
        // If product already in cart — increase quantity
        var existing = cartItemRepository
                .findByUserEmailAndProductId(userEmail, request.getProductId());

        CartItem cartItem;
        if (existing.isPresent()) {
            cartItem = existing.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            cartItem = CartItem.builder()
                    .userEmail(userEmail)
                    .productId(request.getProductId())
                    .productName(request.getProductName())
                    .quantity(request.getQuantity())
                    .unitPrice(request.getUnitPrice())
                    .build();
        }

        CartItem saved = cartItemRepository.save(cartItem);
        log.info("Added to cart for user: {}", userEmail);
        return toCartResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(String userEmail) {
        return cartItemRepository.findByUserEmail(userEmail)
                .stream()
                .map(this::toCartResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeFromCart(String userEmail, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized — not your cart item");
        }

        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(String userEmail) {
        cartItemRepository.deleteByUserEmail(userEmail);
        log.info("Cart cleared for user: {}", userEmail);
    }

    // ─── Checkout ──────────────────────────────────────────

    @Transactional
    public OrderResponse checkout(String userEmail, CheckoutRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserEmail(userEmail);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty — cannot checkout");
        }

        // Calculate total
        BigDecimal total = cartItems.stream()
                .map(item -> item.getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create order
        Order order = Order.builder()
                .userEmail(userEmail)
                .status(OrderStatus.PENDING)
                .totalAmount(total)
                .shippingAddress(request.getShippingAddress())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Create order items from cart
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> OrderItem.builder()
                        .order(savedOrder)
                        .productId(cartItem.getProductId())
                        .productName(cartItem.getProductName())
                        .quantity(cartItem.getQuantity())
                        .unitPrice(cartItem.getUnitPrice())
                        .subtotal(cartItem.getUnitPrice()
                                .multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        savedOrder.setItems(orderItems);
        orderRepository.save(savedOrder);

        // Clear cart after successful checkout
        cartItemRepository.deleteByUserEmail(userEmail);
        log.info("Order {} created for user: {}", savedOrder.getId(), userEmail);

        return toOrderResponse(savedOrder);
    }

    // ─── Order Operations ──────────────────────────────────

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String userEmail) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String userEmail, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized — not your order");
        }

        return toOrderResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return toOrderResponse(orderRepository.save(order));
    }

    // ─── Mappers ───────────────────────────────────────────

    private CartItemResponse toCartResponse(CartItem item) {
        BigDecimal subtotal = item.getUnitPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(subtotal)
                .build();
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems() == null
                ? List.of()
                : order.getItems().stream()
                        .map(item -> OrderItemResponse.builder()
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .subtotal(item.getSubtotal())
                                .build())
                        .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userEmail(order.getUserEmail())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .items(items)
                .createdAt(order.getCreatedAt())
                .build();
    }
}