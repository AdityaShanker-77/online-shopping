import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products';

  constructor(private http: HttpClient) { }

  getProducts(categoryId?: number, keyword?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (categoryId) params = params.append('categoryId', categoryId.toString());
    if (keyword) params = params.append('keyword', keyword);

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('/api/categories');
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
}
