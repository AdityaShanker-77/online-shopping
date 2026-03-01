import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.signup(this.registerForm.value).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Please login.';
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        },
        error: (err) => {
          if (err.error && typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else if (err.message) {
            this.errorMessage = err.message;
          } else {
            this.errorMessage = 'Registration failed. The email might already be in use.';
          }
        }
      });
    }
  }
}
