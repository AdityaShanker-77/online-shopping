import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { CartItem } from '../models/order';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cart.html',
    styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
    cartItems: CartItem[] = [];
    loading = true;

    constructor(private orderService: OrderService) { }

    ngOnInit() {
        this.loadCart();
    }

    loadCart() {
        this.loading = true;
        this.orderService.getCart().subscribe({
            next: (items) => {
                this.cartItems = items;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load cart', err);
                this.loading = false;
            }
        });
    }

    updateQuantity(item: CartItem, delta: number) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) {
            this.removeItem(item.id);
            return;
        }
        this.orderService.updateCartItem(item.id, newQuantity).subscribe({
            next: () => this.loadCart(),
            error: (err) => console.error(err)
        });
    }

    removeItem(itemId: number) {
        this.orderService.removeFromCart(itemId).subscribe({
            next: () => this.loadCart(),
            error: (err) => console.error(err)
        });
    }

    get totalAmount(): number {
        return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
}
