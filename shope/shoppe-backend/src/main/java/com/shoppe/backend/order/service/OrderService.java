package com.shoppe.backend.order.service;

import com.shoppe.backend.order.dto.CartItemDto;
import com.shoppe.backend.order.dto.OrderDto;
import com.shoppe.backend.product.dto.ProductDto;

import java.util.List;

public interface OrderService {
    
    // Cart Methods
    List<CartItemDto> getCartItems(String username);
    CartItemDto addToCart(String username, Long productId, Integer quantity);
    CartItemDto updateCartItem(String username, Long cartItemId, Integer quantity);
    void removeFromCart(String username, Long cartItemId);
    void clearCart(String username);

    // Wishlist Methods
    List<ProductDto> getWishlist(String username);
    void addToWishlist(String username, Long productId);
    void removeFromWishlist(String username, Long wishlistId);

    // Comparison Methods
    List<ProductDto> getComparisonList(String username);
    void addToComparison(String username, Long productId);
    void removeFromComparison(String username, Long comparisonId);

    // Order Methods
    OrderDto checkout(String username, String shippingAddress);
    List<OrderDto> getUserOrders(String username);
    OrderDto getOrderById(Long id, String username);
}
