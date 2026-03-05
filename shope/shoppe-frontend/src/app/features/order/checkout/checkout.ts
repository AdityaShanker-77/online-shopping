import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { CartItem } from '../models/order';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, Truck, ShieldCheck, ShoppingBag, ExternalLink } from 'lucide-angular';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, CardComponent, LucideAngularModule],
    templateUrl: './checkout.html',
    styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {
    checkoutForm: FormGroup;
    loading = false;
    error = '';
    cartItems: CartItem[] = [];
    cartTotal = 0;

    constructor(
        private fb: FormBuilder,
        private orderService: OrderService,
        private router: Router,
        private toastService: ToastService
    ) {
        this.checkoutForm = this.fb.group({
            fullName: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            zipCode: ['', Validators.required]
        });
    }

    get f() { return this.checkoutForm.controls; }

    ngOnInit() {
        this.orderService.getCart().subscribe({
            next: (items) => {
                this.cartItems = items;
                this.cartTotal = Math.round(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100) / 100;
                if (items.length === 0) {
                    this.toastService.info('Your cart is empty.');
                    this.router.navigate(['/order/cart']);
                }
            },
            error: () => this.toastService.error('Could not fetch cart details.')
        });
    }

    onSubmit() {
        if (this.checkoutForm.invalid) {
            this.checkoutForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        const { fullName, address, city, zipCode } = this.checkoutForm.value;
        const fullAddress = `${fullName}, ${address}, ${city}, ${zipCode}`;

        this.orderService.createCheckoutSession(fullAddress).subscribe({
            next: (response) => {
                // Redirect to Stripe's hosted checkout page
                window.location.href = response.url;
            },
            error: (err) => {
                this.error = err?.error?.message || 'Failed to initiate payment. Please try again.';
                this.toastService.error(this.error);
                this.loading = false;
            }
        });
    }
}
