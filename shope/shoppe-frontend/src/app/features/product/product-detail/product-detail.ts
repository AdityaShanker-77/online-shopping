import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../services/product';
import { Product } from '../models/product';
import { OrderService } from '../../order/services/order.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, Heart, ShoppingCart, ArrowLeft, PackageCheck, PackageX, Store, Tag } from 'lucide-angular';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, LucideAngularModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadProduct(Number(idParam));
    }
  }

  loadProduct(id: number) {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details.';
        this.toastService.error('Failed to load product details');
        this.loading = false;
      }
    });
  }

  addToCart() {
    if (this.product) {
      this.orderService.addToCart(this.product.id, 1).subscribe({
        next: () => this.toastService.success(`${this.product?.name} added to cart!`),
        error: (err) => this.toastService.error(err?.error?.message || 'Failed to add to cart.')
      });
    }
  }

  addToWishlist() {
    if (this.product) {
      this.orderService.addToWishlist(this.product.id).subscribe({
        next: () => this.toastService.success(`${this.product?.name} added to wishlist!`),
        error: (err) => this.toastService.error(err?.error?.message || 'Failed to add to wishlist.')
      });
    }
  }

  getProxiedImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'assets/no-image.png';
    return imageUrl;
  }
}
