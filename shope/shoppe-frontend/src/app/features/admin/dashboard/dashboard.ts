import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { User } from '../../../core/models/user.model';
import { RetailerProfile } from '../../retailer/models/retailer';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class AdminDashboard implements OnInit {
    users: User[] = [];
    retailers: RetailerProfile[] = [];

    loadingUsers = true;
    loadingRetailers = true;

    constructor(private adminService: AdminService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loadUsers();
        this.loadRetailers();
    }

    loadUsers() {
        this.loadingUsers = true;
        this.adminService.getUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.loadingUsers = false;
            },
            error: (err) => {
                console.error('Failed to load users', err);
                this.loadingUsers = false;
            }
        });
    }

    loadRetailers() {
        this.loadingRetailers = true;
        this.adminService.getRetailers().subscribe({
            next: (data) => {
                this.retailers = data;
                this.loadingRetailers = false;
            },
            error: (err) => {
                console.error('Failed to load retailers', err);
                this.loadingRetailers = false;
            }
        });
    }

    approveRetailer(id: number) {
        this.adminService.approveRetailer(id).subscribe({
            next: () => {
                alert('Retailer approved successfully');
                this.loadRetailers(); // reload list
            },
            error: (err) => console.error(err)
        });
    }

    deleteRetailer(id: number) {
        if (confirm('Are you sure you want to delete this retailer?')) {
            this.adminService.deleteRetailer(id).subscribe({
                next: () => {
                    this.loadRetailers();
                },
                error: (err) => console.error(err)
            });
        }
    }
}
