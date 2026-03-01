import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, ArrowLeftRight, Trash2, ShoppingBag } from 'lucide-angular';

@Component({
    selector: 'app-compare',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonComponent, LucideAngularModule],
    templateUrl: './compare.html',
    styleUrls: ['./compare.css']
})
export class CompareComponent implements OnInit {
    compareItems: any[] = [];
    loading = true;

    constructor(private orderService: OrderService, private toastService: ToastService) { }

    ngOnInit() {
        this.loadCompareItems();
    }

    loadCompareItems() {
        this.loading = true;
        this.orderService.getCompareItems().subscribe({
            next: (data) => {
                this.compareItems = data;
                this.loading = false;
            },
            error: (err) => {
                this.toastService.error('Failed to load compare list');
                this.loading = false;
            }
        });
    }

    removeItem(productId: number) {
        this.orderService.removeFromCompare(productId).subscribe({
            next: () => {
                this.compareItems = this.compareItems.filter(item => item.id !== productId);
                this.toastService.info('Removed from comparison');
            },
            error: (err) => this.toastService.error(err?.error?.message || 'Failed to remove item')
        });
    }
}
