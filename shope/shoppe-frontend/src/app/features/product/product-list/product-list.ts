import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product';
import { Product } from '../models/product';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../order/services/order.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, Heart, ShoppingCart, ArrowLeftRight, Search, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, LucideAngularModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  products: Product[] = [];
  pagedProducts: Product[] = [];
  categories: any[] = [];
  searchKeyword: string = '';
  selectedCategoryId: string | number | undefined = undefined;

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

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
        this.currentPage = 1;
        this.updatePagination();
      },
      error: (err) => {
        this.toastService.error('Failed to load products');
      }
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.products.length / this.pageSize);
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedProducts = this.products.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
