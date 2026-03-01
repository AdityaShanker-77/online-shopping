import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product';
import { Product } from '../models/product';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { OrderService } from '../../order/services/order.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  products: Product[] = [];
  categories: any[] = [];
  searchKeyword: string = '';
  selectedCategoryId: number | undefined = undefined;

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    console.log('DEBUG: ProductList initialized');
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
    console.log('DEBUG: Loading products with keyword:', this.searchKeyword, 'category:', this.selectedCategoryId);
    this.productService.getProducts(this.selectedCategoryId, this.searchKeyword).subscribe({
      next: (data) => {
        console.log('DEBUG: Received products:', data.length);
        this.products = data;
      },
      error: (err) => {
        console.error('DEBUG: Product load failed:', err);
      }
    });
  }

  onSearch() {
    this.loadProducts();
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();
    this.orderService.addToCart(product.id, 1).subscribe({
      next: () => alert(`${product.name} added to cart!`),
      error: (err) => console.error('Failed to add to cart', err)
    });
  }

  addToWishlist(product: Product, event: Event) {
    event.stopPropagation();
    this.orderService.addToWishlist(product.id).subscribe({
      next: () => alert(`${product.name} added to wishlist!`),
      error: (err) => console.error('Failed to add to wishlist', err)
    });
  }
}
