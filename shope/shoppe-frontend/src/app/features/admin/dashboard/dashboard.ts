import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { User } from '../../../core/models/user.model';
import { RetailerProfile } from '../../retailer/models/retailer';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LucideAngularModule, ShieldCheck, Users, Store, CheckCircle2, Trash2, AlertCircle } from 'lucide-angular';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, ButtonComponent, CardComponent, LucideAngularModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class AdminDashboard implements OnInit {
    users: User[] = [];
    retailers: RetailerProfile[] = [];

    loadingUsers = true;
    loadingRetailers = true;

    constructor(
        private adminService: AdminService,
        private toastService: ToastService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loadingUsers = true;
        this.loadingRetailers = true;

        this.adminService.getUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.loadingUsers = false;
                this.loadRetailers();
            },
            error: (err) => {
                this.toastService.error('Failed to load users');
                this.loadingUsers = false;
                this.loadRetailers();
            }
        });
    }

    loadRetailers() {
        this.adminService.getRetailers().subscribe({
            next: (data) => {
                this.retailers = data;

                const mappedRetailerUserIds = this.retailers.map(r => r.userId);
                const pendingSetupUsers = this.users.filter(u => u.roles.includes('ROLE_RETAILER') && !mappedRetailerUserIds.includes(u.id));

                pendingSetupUsers.forEach(u => {
                    this.retailers.push({
                        id: 0,
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
                this.toastService.error('Failed to load retailers');
                this.loadingRetailers = false;
            }
        });
    }

    approveRetailer(id: number) {
        this.toastService.info('Approving retailer...');
        this.adminService.approveRetailer(id).subscribe({
            next: () => {
                this.toastService.success('Retailer approved successfully');
                this.loadRetailers();
            },
            error: (err) => {
                this.toastService.error('Failed to approve retailer');
            }
        });
    }

    deleteRetailer(id: number) {
        if (confirm('Are you sure you want to delete this retailer? This action cannot be undone.')) {
            this.toastService.info('Processing deletion...');
            this.adminService.deleteRetailer(id).subscribe({
                next: () => {
                    this.toastService.success('Retailer deleted');
                    this.loadRetailers();
                },
                error: (err) => {
                    this.toastService.error('Failed to delete retailer');
                }
            });
        }
    }
}
