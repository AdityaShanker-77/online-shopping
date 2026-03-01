import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, HeartCrack, ShoppingCart, Trash2, Tag } from 'lucide-angular';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonComponent, CardComponent, LucideAngularModule],
    templateUrl: './wishlist.html',
    styleUrls: ['./wishlist.css']
})
export class WishlistComponent implements OnInit {
    wishlistItems: any[] = [];
    isLoading = true;

    constructor(private orderService: OrderService, private toastService: ToastService) { }

    ngOnInit(): void {
        this.loadWishlist();
    }

    loadWishlist() {
        this.isLoading = true;
        this.orderService.getWishlist().subscribe({
            next: (items) => {
                this.wishlistItems = items;
                this.isLoading = false;
            },
            error: (err) => {
                this.toastService.error('Failed to load wishlist');
                this.isLoading = false;
            }
        });
    }

    removeFromWishlist(productId: number) {
        this.orderService.removeFromWishlist(productId).subscribe({
            next: () => {
                this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
                this.toastService.info('Removed from wishlist');
            },
            error: (err) => this.toastService.error(err?.error?.message || 'Failed to remove from wishlist')
        });
    }

    moveToCart(productId: number, productName: string) {
        this.orderService.addToCart(productId, 1).subscribe({
            next: () => {
                this.removeFromWishlist(productId);
                this.toastService.success(`${productName} moved to cart!`);
            },
            error: (err) => this.toastService.error(err?.error?.message || 'Failed to move to cart')
        });
    }
}
