import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem, Order } from '../models/order';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Cart
    getCart(): Observable<CartItem[]> {
        return this.http.get<CartItem[]>(`${this.apiUrl}/cart`);
    }

    addToCart(productId: number, quantity: number): Observable<CartItem> {
        return this.http.post<CartItem>(`${this.apiUrl}/cart/${productId}?quantity=${quantity}`, {});
    }

    updateCartItem(itemId: number, quantity: number): Observable<CartItem> {
        return this.http.put<CartItem>(`${this.apiUrl}/cart/${itemId}?quantity=${quantity}`, {});
    }

    removeFromCart(itemId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/cart/${itemId}`);
    }

    // Wishlist
    getWishlist(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/wishlist`);
    }

    addToWishlist(productId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/wishlist/${productId}`, {});
    }

    removeFromWishlist(productId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/wishlist/${productId}`);
    }

    // Compare
    getCompareItems(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/compare`);
    }

    addToCompare(productId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/compare/${productId}`, {});
    }

    removeFromCompare(productId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/compare/${productId}`);
    }

    // Stripe Checkout
    createCheckoutSession(shippingAddress: string): Observable<{ url: string }> {
        return this.http.post<{ url: string }>(`${this.apiUrl}/orders/create-checkout-session`, { shippingAddress });
    }

    confirmCheckout(sessionId: string): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}/orders/confirm-checkout?session_id=${sessionId}`, {});
    }

    // Orders
    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders`);
    }
}
