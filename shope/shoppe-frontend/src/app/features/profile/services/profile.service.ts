import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiUrl = '/api/users';

    constructor(private http: HttpClient) { }

    getProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}/me`);
    }

    updateProfile(profile: Partial<UserProfile>): Observable<any> {
        return this.http.put(`${this.apiUrl}/me`, profile);
    }
}
