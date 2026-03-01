import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, CreditCard, Truck, ShieldCheck, CheckCircle2 } from 'lucide-angular';

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
    cartTotal = 0; // Fetching from cart service would be ideal, skipping for brevity

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
            zipCode: ['', Validators.required],
            cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
            expiry: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$')]],
            cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
        });
    }

    get f() { return this.checkoutForm.controls; }

    ngOnInit() {
        this.orderService.getCart().subscribe({
            next: (items) => {
                this.cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

        const { address, city, zipCode } = this.checkoutForm.value;
        const fullAddress = `${address}, ${city}, ${zipCode}`;

        this.toastService.info('Processing payment...');
        this.orderService.checkout(fullAddress).subscribe({
            next: (order) => {
                this.toastService.success(`Order placed successfully! ID: ${order.id}`);
                this.router.navigate(['/profile']);
            },
            error: (err) => {
                this.error = err.error || 'Failed to process checkout. Please try again.';
                this.toastService.error(this.error);
                this.loading = false;
            }
        });
    }
}
