import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RetailerService } from '../services/retailer.service';
import { AuthService } from '../../../core/services/auth.service';
import { RetailerProfile } from '../models/retailer';
import { Product } from '../../product/models/product';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-retailer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class RetailerDashboard implements OnInit {
    profile: RetailerProfile | null = null;
    products: Product[] = [];
    loadingProfile = true;
    loadingProducts = true;
    error = '';

    // Form fields
    storeName = '';
    description = '';
    isCreating = false;

    constructor(
        private retailerService: RetailerService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.retailerService.getProfile().subscribe({
            next: (data) => {
                this.profile = data;
                this.loadingProfile = false;

                // Chain the products call now that we have the retailer ID
                this.retailerService.getProducts(this.profile.id).subscribe({
                    next: (prodData) => {
                        this.products = prodData;
                        this.loadingProducts = false;
                    },
                    error: (err) => {
                        console.error('Failed to load products', err);
                        this.loadingProducts = false;
                    }
                });
            },
            error: (err) => {
                // Ignore 404, just means no profile yet
                if (err.status !== 404) {
                    this.error = 'Failed to load retailer profile. Are you an approved retailer?';
                }
                this.loadingProfile = false;
                this.loadingProducts = false;
            }
        });
    }

    createStore() {
        if (!this.storeName || !this.description) return;

        const user = this.authService.currentUser();
        if (!user) return;

        this.isCreating = true;
        const payload = {
            userId: user.id,
            storeName: this.storeName,
            description: this.description
        };

        this.retailerService.createProfile(payload).subscribe({
            next: (data) => {
                this.profile = data;
                this.isCreating = false;
                this.error = '';
            },
            error: (err) => {
                this.error = 'Failed to create store. Please try again.';
                this.isCreating = false;
            }
        });
    }
}
