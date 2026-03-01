import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { RetailerProfile } from '../../retailer/models/retailer';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        // Fallback for Users as there isn't a direct endpoint yet.
        return this.http.get<User[]>(`${this.apiUrl}/auth/users`);
    }

    getRetailers(): Observable<RetailerProfile[]> {
        return this.http.get<RetailerProfile[]>(`${this.apiUrl}/retailers`);
    }

    approveRetailer(id: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/retailers/${id}/approve`, {});
    }

    deleteRetailer(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/retailers/${id}`);
    }
}
