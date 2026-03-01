import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../services/product';
import { Product } from '../models/product';

import { OrderService } from '../../order/services/order.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    private orderService: OrderService
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
        this.loading = false;
      }
    });
  }

  addToCart() {
    if (this.product) {
      this.orderService.addToCart(this.product.id, 1).subscribe({
        next: () => alert(`${this.product?.name} added to cart!`),
        error: (err) => alert('Failed to add to cart.')
      });
    }
  }

  addToWishlist() {
    if (this.product) {
      this.orderService.addToWishlist(this.product.id).subscribe({
        next: () => alert(`${this.product?.name} added to wishlist!`),
        error: (err) => alert('Failed to add to wishlist.')
      });
    }
  }
}
