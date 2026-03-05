import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { UserProfile } from '../models/profile';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { OrderService } from '../../order/services/order.service';
import { Order } from '../../order/models/order';
import { LucideAngularModule, User, Mail, Phone, MapPin, Shield, Camera, Edit2, Check, X, ShoppingBag, Heart, ArrowLeftRight } from 'lucide-angular';

@Component({
    selector: 'app-profile-dashboard',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent, InputComponent, CardComponent, LucideAngularModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class ProfileDashboard implements OnInit {
    profile: UserProfile | null = null;
    profileForm: FormGroup;
    loading = true;
    editing = false;
    message = '';
    uploadMessage = '';
    orders: Order[] = [];

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    constructor(
        private profileService: ProfileService,
        private orderService: OrderService,
        private fb: FormBuilder,
        private toastService: ToastService
    ) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            address: ['']
        });
    }

    get f() { return this.profileForm.controls; }

    ngOnInit() {
        this.loadProfile();
        this.loadOrders();
    }

    loadOrders() {
        this.orderService.getOrders().subscribe({
            next: (orders) => this.orders = orders,
            error: () => { /* silently fail */ }
        });
    }

    loadProfile() {
        this.loading = true;
        this.profileService.getProfile().subscribe({
            next: (data) => {
                this.profile = data;
                this.profileForm.patchValue({
                    name: data.name || data.fullName,
                    email: data.email,
                    phone: data.phone || '',
                    address: data.address || ''
                });
                this.loading = false;
            },
            error: (err) => {
                this.toastService.error('Error loading profile');
                this.loading = false;
            }
        });
    }

    toggleEdit() {
        this.editing = !this.editing;
        if (!this.editing && this.profile) {
            this.profileForm.patchValue({
                name: this.profile.name || this.profile.fullName,
                email: this.profile.email,
                phone: this.profile.phone || '',
                address: this.profile.address || ''
            });
        }
    }

    onSubmit() {
        if (this.profileForm.invalid) return;
        const formVal = this.profileForm.value;
        const payload = {
            fullName: formVal.name,
            email: formVal.email,
            phone: formVal.phone,
            address: formVal.address
        };
        this.profileService.updateProfile(payload).subscribe({
            next: () => {
                this.toastService.success('Profile updated successfully!');
                this.editing = false;
                this.loadProfile();
            },
            error: (err) => {
                this.toastService.error(err.error || 'Failed to update profile.');
            }
        });
    }

    triggerFileInput() {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];

        if (file.size > 2 * 1024 * 1024) {
            this.toastService.error('File must not exceed 2MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            this.toastService.error('Please select an image file');
            return;
        }

        this.toastService.info('Uploading avatar...');
        this.profileService.uploadProfilePicture(file).subscribe({
            next: (res) => {
                this.toastService.success('Profile picture updated!');
                if (this.profile) {
                    this.profile.profilePictureUrl = res.profilePictureUrl;
                }
            },
            error: (err) => {
                this.toastService.error(err?.error?.message || 'Upload failed');
            }
        });

        // Reset the input so the same file can be re-selected
        input.value = '';
    }
}
