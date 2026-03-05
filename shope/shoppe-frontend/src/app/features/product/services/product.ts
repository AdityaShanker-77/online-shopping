import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../models/product';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(categoryId?: string | number, keyword?: string): Observable<Product[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    if (categoryId) params.push(`categoryId=${categoryId}`);
    if (keyword) params.push(`keyword=${keyword}`);
    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<any[]>(url).pipe(
      map(items => items.map(item => this.mapToProduct(item)))
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/categories`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(item => this.mapToProduct(item))
    );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<any>(this.apiUrl, {
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      retailerId: product.retailerId
    }).pipe(map(item => this.mapToProduct(item)));
  }

  // Maps backend ProductDto to our internal Product interface
  private mapToProduct(item: any): Product {
    return {
      id: item.id,
      name: item.name || item.title,
      description: item.description,
      price: item.price,
      stock: item.stock ?? 100,
      categoryId: item.categoryId,
      categoryName: item.categoryName || item.category || '',
      retailerId: item.retailerId || 1,
      retailerName: item.retailerName || '',
      imageUrl: item.imageUrl || item.image || ''
    };
  }
}
