package com.shoppe.order.controller;

import com.shoppe.order.dto.*;
import com.shoppe.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    // Resolve userId from X-Auth-UserId header (set by gateway or auth lookup)
    // For simplicity, userId is passed as a header X-Auth-UserId from gateway
    // In production, parse from JWT claims forwarded by gateway

    // ── Cart ────────────────────────────────

    @GetMapping("/api/cart")
    @Operation(summary = "Get cart items for authenticated user")
    public ResponseEntity<List<CartItemDto>> getCart(@RequestHeader("X-Auth-UserId") Long userId) {
        return ResponseEntity.ok(orderService.getCart(userId));
    }

    @PostMapping("/api/cart/{productId}")
    @Operation(summary = "Add product to cart")
    public ResponseEntity<CartItemDto> addToCart(
            @RequestHeader("X-Auth-UserId") Long userId,
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.addToCart(userId, productId, quantity));
    }

    @PutMapping("/api/cart/{cartItemId}")
    public ResponseEntity<CartItemDto> updateCart(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        CartItemDto result = orderService.updateCartItem(cartItemId, quantity);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/cart/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartItemId) {
        orderService.removeFromCart(cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/cart")
    public ResponseEntity<Void> clearCart(@RequestHeader("X-Auth-UserId") Long userId) {
        orderService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    // ── Wishlist ─────────────────────────────

    @GetMapping("/api/wishlist")
    public ResponseEntity<List<ProductDto>> getWishlist(@RequestHeader("X-Auth-UserId") Long userId) {
        return ResponseEntity.ok(orderService.getWishlist(userId));
    }

    @PostMapping("/api/wishlist/{productId}")
    public ResponseEntity<Void> addToWishlist(
            @RequestHeader("X-Auth-UserId") Long userId,
            @PathVariable Long productId) {
        orderService.addToWishlist(userId, productId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/api/wishlist/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @RequestHeader("X-Auth-UserId") Long userId,
            @PathVariable Long productId) {
        orderService.removeFromWishlist(userId, productId);
        return ResponseEntity.noContent().build();
    }

    // ── Compare ─────────────────────────────

    @GetMapping("/api/compare")
    @Operation(summary = "Get compare list for authenticated user")
    public ResponseEntity<List<ProductDto>> getCompareItems(@RequestHeader("X-Auth-UserId") Long userId) {
        return ResponseEntity.ok(orderService.getCompareItems(userId));
    }

    @PostMapping("/api/compare/{productId}")
    @Operation(summary = "Add product to compare list (max 4)")
    public ResponseEntity<Void> addToCompare(
            @RequestHeader("X-Auth-UserId") Long userId,
            @PathVariable Long productId) {
        orderService.addToCompare(userId, productId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/api/compare/{productId}")
    @Operation(summary = "Remove product from compare list")
    public ResponseEntity<Void> removeFromCompare(
            @RequestHeader("X-Auth-UserId") Long userId,
            @PathVariable Long productId) {
        orderService.removeFromCompare(userId, productId);
        return ResponseEntity.noContent().build();
    }

    // ── Orders ───────────────────────────────

    @PostMapping("/api/orders/create-checkout-session")
    @Operation(summary = "Create Stripe Checkout Session")
    public ResponseEntity<CheckoutSessionResponse> createCheckoutSession(
            @RequestHeader("X-Auth-UserId") Long userId,
            @RequestBody Map<String, String> body) {
        String shippingAddress = body.getOrDefault("shippingAddress", "");
        return ResponseEntity.ok(orderService.createCheckoutSession(userId, shippingAddress));
    }

    @PostMapping("/api/orders/confirm-checkout")
    @Operation(summary = "Confirm Stripe Checkout Session and finalize order")
    public ResponseEntity<OrderDto> confirmCheckout(
            @RequestHeader("X-Auth-UserId") Long userId,
            @RequestParam("session_id") String sessionId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.confirmCheckoutSession(sessionId, userId));
    }

    @GetMapping("/api/orders")
    public ResponseEntity<List<OrderDto>> getMyOrders(@RequestHeader("X-Auth-UserId") Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
}
