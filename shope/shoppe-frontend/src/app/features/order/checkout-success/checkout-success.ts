import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, CheckCircle2, Package, ArrowRight, XCircle } from 'lucide-angular';

@Component({
    selector: 'app-checkout-success',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonComponent, CardComponent, LucideAngularModule],
    templateUrl: './checkout-success.html',
    styleUrls: ['./checkout-success.css']
})
export class CheckoutSuccess implements OnInit {
    loading = true;
    error = '';
    order: Order | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService,
        private toastService: ToastService
    ) { }

    ngOnInit() {
        const sessionId = this.route.snapshot.queryParamMap.get('session_id');
        if (!sessionId) {
            this.error = 'Invalid session. No session ID found.';
            this.loading = false;
            return;
        }

        this.orderService.confirmCheckout(sessionId).subscribe({
            next: (order) => {
                this.order = order;
                this.loading = false;
                this.toastService.success('Order placed successfully!');
            },
            error: (err) => {
                this.error = err?.error?.message || 'Failed to confirm your order. Please contact support.';
                this.loading = false;
                this.toastService.error(this.error);
            }
        });
    }
}
