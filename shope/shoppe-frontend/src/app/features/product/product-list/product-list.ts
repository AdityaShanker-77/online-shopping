import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product';
import { Product } from '../models/product';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../order/services/order.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, Heart, ShoppingCart, ArrowLeftRight, Search } from 'lucide-angular';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, InputComponent, CardComponent, LucideAngularModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  products: Product[] = [];
  categories: any[] = [];
  searchKeyword: string = '';
  selectedCategoryId: string | number | undefined = undefined;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadProducts() {
    this.productService.getProducts(this.selectedCategoryId, this.searchKeyword).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        this.toastService.error('Failed to load products');
      }
    });
  }

  onSearch() {
    this.loadProducts();
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();
    this.orderService.addToCart(product.id, 1).subscribe({
      next: () => this.toastService.success(`${product.name} added to cart!`),
      error: (err) => this.toastService.error(err?.error?.message || 'Failed to add to cart')
    });
  }

  addToWishlist(product: Product, event: Event) {
    event.stopPropagation();
    this.orderService.addToWishlist(product.id).subscribe({
      next: () => this.toastService.success(`${product.name} added to wishlist!`),
      error: (err) => this.toastService.error(err?.error?.message || 'Failed to add to wishlist')
    });
  }

  addToCompare(product: Product, event: Event) {
    event.stopPropagation();
    this.orderService.addToCompare(product.id).subscribe({
      next: () => this.toastService.success(`${product.name} added to compare!`),
      error: (err) => {
        const msg = err?.error?.message || 'Maximum 4 products can be compared';
        this.toastService.error(msg);
      }
    });
  }

  getProxiedImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'assets/no-image.png';
    return imageUrl;
  }
}
