import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, CreditCard, Truck, ShieldCheck, CheckCircle2 } from 'lucide-angular';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, CardComponent, LucideAngularModule],
    templateUrl: './checkout.html',
    styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit, AfterViewInit {
    checkoutForm: FormGroup;
    loading = false;
    error = '';
    cartTotal = 0;

    stripe: Stripe | null = null;
    elements: StripeElements | null = null;
    cardElement: StripeCardElement | null = null;

    @ViewChild('cardInfo', { static: false }) cardInfo!: ElementRef;

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

    async ngOnInit() {
        this.orderService.getCart().subscribe({
            next: (items) => {
                this.cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            },
            error: () => this.toastService.error('Could not fetch cart details.')
        });

        // Initialize Stripe with user's specific key
        this.stripe = await loadStripe('pk_test_51RDmQw3CNaXxXDkZfKS3lq93L4bl6GlpazMEimsKo1G80JcW1Xv6bgT5iFZsSpGglSoWhf8jXCgVEpJik7uIFnxs00Ah1FOq0P');
    }

    ngAfterViewInit() {
        if (this.stripe) {
            this.elements = this.stripe.elements();
            this.cardElement = this.elements.create('card', {
                style: {
                    base: {
                        color: '#ffffff',
                        fontFamily: 'Inter, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#9ca3af'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                }
            });
            this.cardElement.mount(this.cardInfo.nativeElement);
        }
    }

    async onSubmit() {
        if (this.checkoutForm.invalid || !this.stripe || !this.cardElement) {
            this.checkoutForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        const { address, city, zipCode } = this.checkoutForm.value;
        const fullAddress = `${address}, ${city}, ${zipCode}`;

        try {
            // 1. Create Payment Intent on backend via OrderService
            const paymentIntentClientSecret = await this.orderService.createPaymentIntent(this.cartTotal).toPromise();

            if (!paymentIntentClientSecret) {
                throw new Error("Failed to initialize payment backend");
            }

            // 2. Confirm Payment via Stripe UI
            const { error, paymentIntent } = await this.stripe.confirmCardPayment(paymentIntentClientSecret.clientSecret, {
                payment_method: {
                    card: this.cardElement,
                    billing_details: {
                        name: this.checkoutForm.value.fullName,
                    }
                }
            });

            if (error) {
                this.error = error.message || 'Payment processing failed';
                this.toastService.error(this.error);
                this.loading = false;
                return;
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                // 3. Register the order formally 
                this.toastService.info('Processing order details...');
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
        } catch (err: any) {
            console.error(err);
            this.error = 'An unexpected payment error occurred.';
            this.toastService.error(this.error);
            this.loading = false;
        }
    }
}
