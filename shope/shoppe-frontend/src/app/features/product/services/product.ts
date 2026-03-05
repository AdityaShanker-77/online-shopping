import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) { }

  // Maps FakeStore product format to our internal Product interface
  private mapToProduct(item: any): Product {
    return {
      id: item.id,
      name: item.title,
      description: item.description,
      price: item.price,
      stock: 100, // Hardcoded since FakeStore lacks stock info
      categoryId: item.category, // Using category name as ID for FakeStore
      categoryName: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      retailerId: 1,
      retailerName: 'FakeStore',
      imageUrl: item.image
    };
  }

  getProducts(categoryId?: string | number, keyword?: string): Observable<Product[]> {
    // If a category is selected, use the category endpoint
    const url = categoryId ? `${this.apiUrl}/category/${categoryId}` : this.apiUrl;

    return this.http.get<any[]>(url).pipe(
      map(items => {
        let mapped = items.map(this.mapToProduct);
        // Implement simple client-side keyword search if needed
        if (keyword) {
          const lowerKeyword = keyword.toLowerCase();
          mapped = mapped.filter(p => p.name.toLowerCase().includes(lowerKeyword) || p.description.toLowerCase().includes(lowerKeyword));
        }
        return mapped;
      })
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`).pipe(
      map(categories => categories.map(cat => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1)
      })))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(this.mapToProduct)
    );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    // FakeStore allows POST but it just returns the object with a generated id (doesn't save)
    return this.http.post<any>(this.apiUrl, {
      title: product.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      category: product.categoryName
    }).pipe(map(this.mapToProduct));
  }
}
