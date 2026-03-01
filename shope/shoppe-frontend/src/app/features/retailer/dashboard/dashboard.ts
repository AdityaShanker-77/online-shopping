import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetailerService } from '../services/retailer.service';
import { RetailerProfile } from '../models/retailer';
import { Product } from '../../product/models/product';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-retailer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class RetailerDashboard implements OnInit {
    profile: RetailerProfile | null = null;
    products: Product[] = [];
    loadingProfile = true;
    loadingProducts = true;
    error = '';

    constructor(private retailerService: RetailerService) { }

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
                this.error = 'Failed to load retailer profile. Are you an approved retailer?';
                this.loadingProfile = false;
                this.loadingProducts = false;
            }
        });
    }
}
