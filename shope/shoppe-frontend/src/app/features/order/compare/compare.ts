import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
    selector: 'app-compare',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './compare.html',
    styleUrls: ['./compare.css']
})
export class CompareComponent implements OnInit {
    compareItems: any[] = [];
    loading = true;

    constructor(private orderService: OrderService) { }

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
                console.error('Failed to load compare items', err);
                this.loading = false;
            }
        });
    }

    removeItem(productId: number) {
        this.orderService.removeFromCompare(productId).subscribe({
            next: () => {
                this.compareItems = this.compareItems.filter(item => item.id !== productId);
            },
            error: (err) => console.error(err)
        });
    }
}
