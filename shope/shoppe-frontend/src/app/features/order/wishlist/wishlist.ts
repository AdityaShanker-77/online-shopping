import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './wishlist.html',
    styleUrls: ['./wishlist.css']
})
export class WishlistComponent implements OnInit {
    wishlistItems: any[] = [];
    isLoading = true;

    constructor(private orderService: OrderService) { }

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
                console.error('Failed to load wishlist', err);
                this.isLoading = false;
            }
        });
    }

    removeFromWishlist(productId: number) {
        this.orderService.removeFromWishlist(productId).subscribe({
            next: () => {
                this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
            },
            error: (err) => console.error('Failed to remove from wishlist', err)
        });
    }

    moveToCart(productId: number) {
        this.orderService.addToCart(productId, 1).subscribe({
            next: () => {
                this.removeFromWishlist(productId);
                // Optionally show success message here
            },
            error: (err) => console.error('Failed to move to cart', err)
        });
    }
}
