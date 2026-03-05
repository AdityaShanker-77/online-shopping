import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RetailerService } from '../services/retailer.service';
import { AuthService } from '../../../core/services/auth.service';
import { RetailerProfile } from '../models/retailer';
import { Product } from '../../product/models/product';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';

import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, Store, User, DollarSign, Package, Edit, Plus, AlertCircle, CheckCircle2 } from 'lucide-angular';

@Component({
    selector: 'app-retailer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, CardComponent, LucideAngularModule],
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
        private authService: AuthService,
        private toastService: ToastService
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
                        this.toastService.error('Failed to load products');
                        this.loadingProducts = false;
                    }
                });
            },
            error: (err) => {
                // Ignore 404, just means no profile yet
                if (err.status !== 404) {
                    this.error = 'Failed to load retailer profile. Are you an approved retailer?';
                    this.toastService.error(this.error);
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
        this.toastService.info('Creating your store profile...');
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
                this.toastService.success('Store profile created successfully! Pending admin approval.');
            },
            error: (err) => {
                this.error = 'Failed to create store. Please try again.';
                this.toastService.error(this.error);
                this.isCreating = false;
            }
        });
    }
}
