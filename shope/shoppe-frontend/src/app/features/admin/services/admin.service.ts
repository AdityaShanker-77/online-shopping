import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { RetailerProfile } from '../../retailer/models/retailer';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = '/api/admin';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        // Fallback for Users as there isn't a direct endpoint yet.
        return this.http.get<User[]>(`/api/auth/users`);
    }

    getRetailers(): Observable<RetailerProfile[]> {
        return this.http.get<RetailerProfile[]>(`/api/retailers`);
    }

    approveRetailer(id: number): Observable<any> {
        return this.http.patch(`/api/retailers/${id}/approve`, {});
    }

    deleteRetailer(id: number): Observable<any> {
        return this.http.delete(`/api/retailers/${id}`);
    }
}
