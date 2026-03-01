import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtResponse, User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/auth';

    // Using Angular v16+ Signals for reactive state
    currentUser = signal<User | null>(this.getUserFromStorage());

    constructor(private http: HttpClient) { }

    login(credentials: { email: string, password: string }): Observable<JwtResponse> {
        return this.http.post<JwtResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                this.saveToken(response.token);
                this.saveUser(response);
            })
        );
    }

    signup(user: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/signup`, user);
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    private saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    private saveUser(user: JwtResponse): void {
        const userData: User = { id: user.id, email: user.email, roles: user.roles };
        localStorage.setItem('user', JSON.stringify(userData));
        this.currentUser.set(userData);
    }

    private getUserFromStorage(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}
