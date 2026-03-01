import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
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
        private router: Router
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

    ngOnInit() {
        // Just fetch cart to show total (or should be passed via state)
        this.orderService.getCart().subscribe({
            next: (items) => {
                this.cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            }
        });
    }

    onSubmit() {
        if (this.checkoutForm.invalid) return;

        this.loading = true;
        this.error = '';

        const { address, city, zipCode } = this.checkoutForm.value;
        const fullAddress = `${address}, ${city}, ${zipCode}`;

        this.orderService.checkout(fullAddress).subscribe({
            next: (order) => {
                alert('Order placed successfully! Order ID: ' + order.id);
                this.router.navigate(['/profile']);
            },
            error: (err) => {
                this.error = err.error || 'Failed to process checkout. Please try again.';
                this.loading = false;
            }
        });
    }
}
