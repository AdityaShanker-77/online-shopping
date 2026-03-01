import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RetailerProfile } from '../models/retailer';
import { Product } from '../../product/models/product';

@Injectable({
    providedIn: 'root'
})
export class RetailerService {
    private apiUrl = '/api/retailers';

    constructor(private http: HttpClient) { }

    getProfile(): Observable<RetailerProfile> {
        return this.http.get<RetailerProfile>(`${this.apiUrl}/profile`);
    }

    getProducts(retailerId: number): Observable<Product[]> {
        return this.http.get<Product[]>(`/api/products/by-retailer/${retailerId}`);
    }

    createProfile(profileData: any): Observable<RetailerProfile> {
        return this.http.post<RetailerProfile>(this.apiUrl, profileData);
    }
}
