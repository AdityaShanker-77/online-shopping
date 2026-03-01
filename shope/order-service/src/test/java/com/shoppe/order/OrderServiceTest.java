package com.shoppe.order;

import com.shoppe.order.client.ProductServiceClient;
import com.shoppe.order.dto.CartItemDto;
import com.shoppe.order.dto.ProductDto;
import com.shoppe.order.model.CartItem;
import com.shoppe.order.repository.CartItemRepository;
import com.shoppe.order.repository.OrderRepository;
import com.shoppe.order.repository.WishlistRepository;
import com.shoppe.order.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private WishlistRepository wishlistRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private ProductServiceClient productServiceClient;

    @InjectMocks
    private OrderService orderService;

    private ProductDto productDto;
    private CartItem cartItem;

    @BeforeEach
    void setUp() {
        productDto = new ProductDto();
        productDto.setId(1L);
        productDto.setName("Laptop");
        productDto.setPrice(BigDecimal.valueOf(999.99));
        productDto.setStock(10);
        productDto.setImageUrl("http://example.com/image.jpg");

        cartItem = new CartItem();
        cartItem.setId(1L);
        cartItem.setUserId(1L);
        cartItem.setProductId(1L);
        cartItem.setProductName("Laptop");
        cartItem.setPrice(BigDecimal.valueOf(999.99));
        cartItem.setQuantity(2);
    }

    @Test
    void getCart_shouldReturnCartItems() {
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(cartItem));
        List<CartItemDto> result = orderService.getCart(1L);
        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getProductName());
    }

    @Test
    void addToCart_whenNewItem_shouldCreateCartItem() {
        when(productServiceClient.getProductById(1L)).thenReturn(productDto);
        when(cartItemRepository.findByUserIdAndProductId(1L, 1L)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(cartItem);

        CartItemDto result = orderService.addToCart(1L, 1L, 2);
        assertNotNull(result);
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    void addToCart_whenExistingItem_shouldIncrementQuantity() {
        cartItem.setQuantity(1);
        when(productServiceClient.getProductById(1L)).thenReturn(productDto);
        when(cartItemRepository.findByUserIdAndProductId(1L, 1L)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(inv -> inv.getArgument(0));

        CartItemDto result = orderService.addToCart(1L, 1L, 2);
        assertNotNull(result);
        assertEquals(3, cartItem.getQuantity());
    }

    @Test
    void clearCart_shouldDeleteAllUserCartItems() {
        orderService.clearCart(1L);
        verify(cartItemRepository, times(1)).deleteByUserId(1L);
    }

    @Test
    void checkout_whenCartIsEmpty_shouldThrowException() {
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of());
        assertThrows(RuntimeException.class, () -> orderService.checkout(1L, "123 Main Street"));
    }

    @Test
    void checkout_whenStockInsufficient_shouldThrowException() {
        productDto.setStock(1);
        cartItem.setQuantity(5);
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(cartItem));
        when(productServiceClient.getProductById(1L)).thenReturn(productDto);

        assertThrows(RuntimeException.class, () -> orderService.checkout(1L, "123 Main Street"));
    }
}
