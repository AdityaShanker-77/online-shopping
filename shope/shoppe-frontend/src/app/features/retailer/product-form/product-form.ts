import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../product/services/product';
import { RetailerService } from '../services/retailer.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, Package, ArrowLeft, UploadCloud, Link, Trash2, CheckCircle2, AlertCircle, Save } from 'lucide-angular';

@Component({
    selector: 'app-retailer-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent, InputComponent, CardComponent, LucideAngularModule],
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

    // Image upload state
    imageMode: 'url' | 'upload' = 'url';
    imagePreview: string | null = null;
    imageDimensions: { width: number; height: number } | null = null;
    imageWarning = '';
    uploadError = '';
    isUploading = false;
    isDragOver = false;

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private retailerService: RetailerService,
        private router: Router,
        private http: HttpClient,
        private toastService: ToastService
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

    get f() { return this.productForm.controls; }

    ngOnInit(): void {
        this.productService.getCategories().subscribe(data => {
            this.categories = data;
        });

        this.retailerService.getProfile().subscribe({
            next: (profile) => {
                this.retailerId = profile.id;
            },
            error: () => {
                this.errorMessage = 'Could not load retailer profile. Cannot create products.';
                this.toastService.error(this.errorMessage);
            }
        });
    }

    onSubmit(): void {
        if (this.productForm.invalid || !this.retailerId) {
            this.productForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        this.toastService.info('Publishing product...');

        const formVal = this.productForm.value;
        const productData = {
            name: formVal.name,
            price: +formVal.price,
            stock: +formVal.stock,
            categoryId: +formVal.categoryId,
            description: formVal.description || '',
            imageUrl: formVal.imageUrl || '',
            retailerId: this.retailerId
        };

        this.productService.createProduct(productData).subscribe({
            next: () => {
                this.toastService.success('Product successfully published!');
                this.productForm.reset();
                this.imagePreview = null;
                this.imageDimensions = null;
                this.imageWarning = '';
                this.isSubmitting = false;
                setTimeout(() => this.router.navigate(['/retailer/dashboard']), 500);
            },
            error: (err) => {
                this.errorMessage = err?.error?.message || err?.error?.error || err?.message || 'Failed to create product.';
                this.toastService.error(this.errorMessage);
                this.isSubmitting = false;
            }
        });
    }

    // ========== Image Upload Methods ==========

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = true;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.uploadFile(files[0]);
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;
        this.uploadFile(input.files[0]);
        input.value = ''; // reset so same file can be re-selected
    }

    private uploadFile(file: File) {
        this.uploadError = '';
        this.imageWarning = '';

        // Client-side validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            this.uploadError = 'Invalid format. Only JPEG, PNG and WebP images are accepted.';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.uploadError = 'File too large. Maximum size is 5MB.';
            return;
        }

        this.isUploading = true;

        const formData = new FormData();
        formData.append('file', file);

        this.http.post<any>('/api/products/upload-image', formData).subscribe({
            next: (res) => {
                this.imagePreview = res.imageUrl;
                this.imageDimensions = { width: res.width, height: res.height };
                this.productForm.patchValue({ imageUrl: res.imageUrl });
                this.imageWarning = res.warning || '';
                this.isUploading = false;
            },
            error: (err) => {
                this.uploadError = err?.error?.message || 'Upload failed. Please try again.';
                this.isUploading = false;
            }
        });
    }

    removeImage(event: Event) {
        event.stopPropagation();
        this.imagePreview = null;
        this.imageDimensions = null;
        this.imageWarning = '';
        this.uploadError = '';
        this.productForm.patchValue({ imageUrl: '' });
    }
}
