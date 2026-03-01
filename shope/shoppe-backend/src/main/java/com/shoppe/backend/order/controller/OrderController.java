package com.shoppe.backend.order.controller;

import com.shoppe.backend.order.dto.CartItemDto;
import com.shoppe.backend.order.dto.OrderDto;
import com.shoppe.backend.order.service.OrderService;
import com.shoppe.backend.product.dto.ProductDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('USER') or hasRole('RETAILER') or hasRole('ADMIN')")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // --- Cart Endpoints ---
    @GetMapping("/cart")
    public ResponseEntity<List<CartItemDto>> getCart(Authentication authentication) {
        return ResponseEntity.ok(orderService.getCartItems(authentication.getName()));
    }

    @PostMapping("/cart")
    public ResponseEntity<CartItemDto> addToCart(@RequestBody Map<String, Object> payload, Authentication authentication) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());
        return ResponseEntity.ok(orderService.addToCart(authentication.getName(), productId, quantity));
    }

    @PutMapping("/cart/{itemId}")
    public ResponseEntity<CartItemDto> updateCartItem(@PathVariable Long itemId, @RequestBody Map<String, Integer> payload, Authentication authentication) {
        return ResponseEntity.ok(orderService.updateCartItem(authentication.getName(), itemId, payload.get("quantity")));
    }

    @DeleteMapping("/cart/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long itemId, Authentication authentication) {
        orderService.removeFromCart(authentication.getName(), itemId);
        return ResponseEntity.ok().build();
    }

    // --- Wishlist Endpoints ---
    @GetMapping("/wishlist")
    public ResponseEntity<List<ProductDto>> getWishlist(Authentication authentication) {
        return ResponseEntity.ok(orderService.getWishlist(authentication.getName()));
    }

    @PostMapping("/wishlist")
    public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Long> payload, Authentication authentication) {
        orderService.addToWishlist(authentication.getName(), payload.get("productId"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/wishlist/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, Authentication authentication) {
        orderService.removeFromWishlist(authentication.getName(), productId);
        return ResponseEntity.ok().build();
    }

    // --- Compare Endpoints ---
    @GetMapping("/compare")
    public ResponseEntity<List<ProductDto>> getComparison(Authentication authentication) {
        return ResponseEntity.ok(orderService.getComparisonList(authentication.getName()));
    }

    @PostMapping("/compare")
    public ResponseEntity<?> addToCompare(@RequestBody Map<String, Long> payload, Authentication authentication) {
        try {
            orderService.addToComparison(authentication.getName(), payload.get("productId"));
            return ResponseEntity.ok().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/compare/{productId}")
    public ResponseEntity<?> removeFromCompare(@PathVariable Long productId, Authentication authentication) {
        orderService.removeFromComparison(authentication.getName(), productId);
        return ResponseEntity.ok().build();
    }

    // --- Checkout & Orders Endpoints ---
    @PostMapping("/orders/checkout")
    public ResponseEntity<OrderDto> checkout(@RequestBody Map<String, String> payload, Authentication authentication) {
        return ResponseEntity.ok(orderService.checkout(authentication.getName(), payload.get("shippingAddress")));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getUserOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getUserOrders(authentication.getName()));
    }
}
