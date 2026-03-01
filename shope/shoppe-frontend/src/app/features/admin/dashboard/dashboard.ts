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
        this.loadingUsers = true;
        this.loadingRetailers = true;
        // Load users first, then load retailers so we can cross-reference them
        this.adminService.getUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.loadingUsers = false;
                this.loadRetailers();
            },
            error: (err) => {
                console.error('Failed to load users', err);
                this.loadingUsers = false;
                this.loadRetailers();
            }
        });
    }

    loadRetailers() {
        this.adminService.getRetailers().subscribe({
            next: (data) => {
                this.retailers = data;

                // Cross-reference: find users with ROLE_RETAILER who haven't created a store yet
                const mappedRetailerUserIds = this.retailers.map(r => r.userId);
                const pendingSetupUsers = this.users.filter(u => u.roles.includes('ROLE_RETAILER') && !mappedRetailerUserIds.includes(u.id));

                // Push them into the array for visual display as "Awaiting Setup"
                pendingSetupUsers.forEach(u => {
                    this.retailers.push({
                        id: 0, // 0 = dummy id since it has no DB record
                        userId: u.id,
                        storeName: 'Pending Store Setup',
                        ownerName: u.name,
                        email: u.email,
                        revenue: 0,
                        approved: false,
                        description: ''
                    } as RetailerProfile);
                });

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
