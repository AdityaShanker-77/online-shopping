import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonComponent, InputComponent, CardComponent],
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

    constructor(private http: HttpClient, private toastService: ToastService) { }

    requestOtp() {
        if (!this.email) return;
        this.loading = true;
        this.http.post<any>('/api/auth/forgot-password', { email: this.email }).subscribe({
            next: (res) => {
                this.toastService.info(res.message || 'OTP Sent to email');
                this.step = 'otp';
                this.loading = false;
            },
            error: (err) => {
                this.toastService.error(err?.error?.message || 'Something went wrong.');
                this.loading = false;
            }
        });
    }

    resetPassword() {
        if (this.newPassword !== this.confirmPassword) {
            this.toastService.error('Passwords do not match!');
            return;
        }
        if (this.newPassword.length < 6) {
            this.toastService.error('Password must be at least 6 characters.');
            return;
        }
        this.loading = true;
        this.http.post<any>('/api/auth/reset-password', {
            email: this.email,
            otp: this.otp,
            newPassword: this.newPassword
        }).subscribe({
            next: (res) => {
                this.toastService.success(res.message || 'Password successfully reset.');
                this.step = 'done';
                this.loading = false;
            },
            error: (err) => {
                this.toastService.error(err?.error?.message || 'Invalid OTP or something went wrong.');
                this.loading = false;
            }
        });
    }
}
