import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './forgot-password.html',
    styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
    email = '';
    otp = '';
    newPassword = '';
    confirmPassword = '';

    step: 'email' | 'otp' | 'done' = 'email';
    message = '';
    error = '';
    loading = false;

    constructor(private http: HttpClient) { }

    requestOtp() {
        if (!this.email) return;
        this.loading = true;
        this.error = '';
        this.http.post<any>('/api/auth/forgot-password', { email: this.email }).subscribe({
            next: (res) => {
                this.message = res.message;
                this.step = 'otp';
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.message || 'Something went wrong.';
                this.loading = false;
            }
        });
    }

    resetPassword() {
        if (this.newPassword !== this.confirmPassword) {
            this.error = 'Passwords do not match!';
            return;
        }
        if (this.newPassword.length < 6) {
            this.error = 'Password must be at least 6 characters.';
            return;
        }
        this.loading = true;
        this.error = '';
        this.http.post<any>('/api/auth/reset-password', {
            email: this.email,
            otp: this.otp,
            newPassword: this.newPassword
        }).subscribe({
            next: (res) => {
                this.message = res.message;
                this.step = 'done';
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.message || 'Invalid OTP or something went wrong.';
                this.loading = false;
            }
        });
    }
}
