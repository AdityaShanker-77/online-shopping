package com.shoppe.order.service;

import com.shoppe.order.client.ProductServiceClient;
import com.shoppe.order.client.RetailerServiceClient;
import com.shoppe.order.dto.*;
import com.shoppe.order.model.*;
import com.shoppe.order.repository.*;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartItemRepository cartItemRepository;
    private final WishlistRepository wishlistRepository;
    private final CompareItemRepository compareItemRepository;
    private final OrderRepository orderRepository;
    private final ProductServiceClient productServiceClient;
    private final RetailerServiceClient retailerServiceClient;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${shoppe.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    // ─── Cart ────────────────────────────────────────────

    public List<CartItemDto> getCart(Long userId) {
        return cartItemRepository.findByUserId(userId).stream().map(this::toCartDto).collect(Collectors.toList());
    }

    @Transactional
    public CartItemDto addToCart(Long userId, Long productId, Integer quantity) {
        ProductDto product = productServiceClient.getProductById(productId);
        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(userId, productId);
        CartItem item = existing.orElseGet(() -> {
            CartItem c = new CartItem();
            c.setUserId(userId);
            c.setProductId(productId);
            c.setProductName(product.getName());
            c.setPrice(product.getPrice());
            c.setImageUrl(product.getImageUrl());
            c.setQuantity(0);
            return c;
        });
        item.setQuantity(item.getQuantity() + quantity);
        return toCartDto(cartItemRepository.save(item));
    }

    @Transactional
    public CartItemDto updateCartItem(Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }
        item.setQuantity(quantity);
        return toCartDto(cartItemRepository.save(item));
    }

    @Transactional
    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    // ─── Wishlist ─────────────────────────────────────────

    public List<ProductDto> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).stream().map(w -> {
            ProductDto dto = new ProductDto();
            dto.setId(w.getProductId());
            dto.setName(w.getProductName());
            dto.setImageUrl(w.getImageUrl());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void addToWishlist(Long userId, Long productId) {
        if (wishlistRepository.findByUserIdAndProductId(userId, productId).isEmpty()) {
            ProductDto product = productServiceClient.getProductById(productId);
            Wishlist w = new Wishlist();
            w.setUserId(userId);
            w.setProductId(productId);
            w.setProductName(product.getName());
            w.setImageUrl(product.getImageUrl());
            wishlistRepository.save(w);
        }
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.findByUserIdAndProductId(userId, productId).ifPresent(wishlistRepository::delete);
    }

    // ─── Compare ─────────────────────────────────────────

    public List<ProductDto> getCompareItems(Long userId) {
        return compareItemRepository.findByUserId(userId).stream().map(c -> {
            ProductDto dto = new ProductDto();
            dto.setId(c.getProductId());
            dto.setName(c.getProductName());
            dto.setImageUrl(c.getImageUrl());
            dto.setPrice(c.getPrice() != null ? BigDecimal.valueOf(c.getPrice()) : BigDecimal.ZERO);
            dto.setCategoryName(c.getCategory());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void addToCompare(Long userId, Long productId) {
        if (compareItemRepository.findByUserIdAndProductId(userId, productId).isPresent()) {
            return; // already in compare list
        }
        if (compareItemRepository.countByUserId(userId) >= 4) {
            throw new RuntimeException("Maximum 4 products can be compared at once");
        }
        ProductDto product = productServiceClient.getProductById(productId);
        CompareItem c = new CompareItem();
        c.setUserId(userId);
        c.setProductId(productId);
        c.setProductName(product.getName());
        c.setImageUrl(product.getImageUrl());
        c.setPrice(product.getPrice() != null ? product.getPrice().doubleValue() : 0);
        c.setCategory(product.getCategoryName());
        compareItemRepository.save(c);
    }

    @Transactional
    public void removeFromCompare(Long userId, Long productId) {
        compareItemRepository.findByUserIdAndProductId(userId, productId).ifPresent(compareItemRepository::delete);
    }

    // ─── Stripe Checkout Session ──────────────────────────

    public CheckoutSessionResponse createCheckoutSession(Long userId, String shippingAddress) {
        try {
            Stripe.apiKey = this.stripeSecretKey;

            List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
            if (cartItems.isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
            for (CartItem item : cartItems) {
                long unitAmountInCents = item.getPrice().multiply(BigDecimal.valueOf(100)).longValue();
                lineItems.add(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity((long) item.getQuantity())
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(unitAmountInCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(item.getProductName())
                                                                .build())
                                                .build())
                                .build());
            }

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(frontendUrl + "/order/checkout-success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(frontendUrl + "/order/cart")
                    .addAllLineItem(lineItems)
                    .putMetadata("userId", userId.toString())
                    .putMetadata("shippingAddress", shippingAddress)
                    .build();

            Session session = Session.create(params);
            return new CheckoutSessionResponse(session.getUrl());
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Stripe Checkout Session", e);
        }
    }

    @Transactional
    public OrderDto confirmCheckoutSession(String sessionId, Long userId) {
        try {
            Stripe.apiKey = this.stripeSecretKey;
            Session session = Session.retrieve(sessionId);

            if (!"paid".equals(session.getPaymentStatus())) {
                throw new RuntimeException("Payment not completed");
            }

            String shippingAddress = session.getMetadata().getOrDefault("shippingAddress", "");
            return checkout(userId, shippingAddress);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to confirm checkout session", e);
        }
    }

    @Transactional
    public OrderDto checkout(Long userId, String shippingAddress) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty())
            throw new RuntimeException("Cart is empty");

        Order order = new Order();
        order.setUserId(userId);
        order.setShippingAddress(shippingAddress);
        order.setStatus("PENDING");
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            ProductDto product = productServiceClient.getProductById(item.getProductId());

            // Deduct stock via Feign — best-effort for products not in local DB (e.g.
            // FakeStore)
            try {
                if (product.getStock() < item.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for: " + product.getName());
                }
                product.setStock(product.getStock() - item.getQuantity());
                productServiceClient.updateProduct(product.getId(), product);
            } catch (feign.FeignException.NotFound e) {
                // Product exists via FakeStore fallback but not in local DB — skip stock
                // deduction
            }

            // Update retailer revenue
            if (product.getRetailerId() != null) {
                BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                try {
                    retailerServiceClient.addRevenue(product.getRetailerId(), itemTotal);
                } catch (Exception e) {
                    System.err.println(
                            "Failed to update revenue for retailer " + product.getRetailerId() + ": " + e.getMessage());
                }
            }

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProductId(product.getId());
            oi.setProductName(product.getName());
            oi.setQuantity(item.getQuantity());
            oi.setPriceAtPurchase(product.getPrice());
            order.getOrderItems().add(oi);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        order.setStatus("COMPLETED");
        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);
        cartItemRepository.deleteByUserId(userId);
        return toOrderDto(saved);
    }

    public List<OrderDto> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId).stream().map(this::toOrderDto).collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long orderId) {
        return toOrderDto(orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found")));
    }

    // ─── Mappers ──────────────────────────────────────────

    private CartItemDto toCartDto(CartItem item) {
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        dto.setProductId(item.getProductId());
        dto.setProductName(item.getProductName());
        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setImageUrl(item.getImageUrl());
        return dto;
    }

    private OrderDto toOrderDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setItems(order.getOrderItems().stream().map(item -> {
            OrderItemDto i = new OrderItemDto();
            i.setProductId(item.getProductId());
            i.setProductName(item.getProductName());
            i.setQuantity(item.getQuantity());
            i.setPriceAtPurchase(item.getPriceAtPurchase());
            return i;
        }).collect(Collectors.toList()));
        return dto;
    }
}
