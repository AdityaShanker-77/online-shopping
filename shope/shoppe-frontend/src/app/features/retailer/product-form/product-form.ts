import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../product/services/product';
import { RetailerService } from '../services/retailer.service';

@Component({
    selector: 'app-retailer-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './product-form.html',
    styleUrls: ['./product-form.css']
})
export class RetailerProductForm implements OnInit {
    productForm: FormGroup;
    categories: any[] = [];
    retailerId: number | null = null;
    errorMessage = '';
    successMessage = '';
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private retailerService: RetailerService,
        private router: Router
    ) {
        this.productForm = this.fb.group({
            name: ['', Validators.required],
            price: ['', [Validators.required, Validators.min(0.01)]],
            stock: ['', [Validators.required, Validators.min(0)]],
            categoryId: ['', Validators.required],
            description: [''],
            imageUrl: ['']
        });
    }

    ngOnInit(): void {
        // Load categories for dropdown
        this.productService.getCategories().subscribe(data => {
            this.categories = data;
        });

        // Ensure we have a profile to link the product to
        this.retailerService.getProfile().subscribe({
            next: (profile) => {
                this.retailerId = profile.id;
            },
            error: () => {
                this.errorMessage = 'Could not load retailer profile. Cannot create products.';
            }
        });
    }

    onSubmit(): void {
        if (this.productForm.invalid || !this.retailerId) {
            return;
        }

        this.isSubmitting = true;
        const productData = {
            ...this.productForm.value,
            retailerId: this.retailerId
        };

        this.productService.createProduct(productData).subscribe({
            next: () => {
                this.successMessage = 'Product successfully added!';
                this.productForm.reset();
                this.isSubmitting = false;
                setTimeout(() => this.router.navigate(['/retailer/dashboard']), 1500);
            },
            error: (err) => {
                this.errorMessage = 'Failed to create product.';
                this.isSubmitting = false;
            }
        });
    }
}
