import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { CartItem } from '../models/order';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-angular';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonComponent, CardComponent, LucideAngularModule],
    templateUrl: './cart.html',
    styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
    cartItems: CartItem[] = [];
    loading = true;

    constructor(private orderService: OrderService, private toastService: ToastService) { }

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
                this.toastService.error('Failed to load cart');
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
            error: (err) => this.toastService.error(err?.error?.message || 'Failed to update quantity')
        });
    }

    removeItem(itemId: number) {
        this.orderService.removeFromCart(itemId).subscribe({
            next: () => {
                this.toastService.info('Item removed from cart');
                this.loadCart();
            },
            error: (err) => this.toastService.error(err?.error?.message || 'Failed to remove item')
        });
    }

    get totalAmount(): number {
        return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
}
