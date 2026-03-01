import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { UserProfile } from '../models/profile';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-profile-dashboard',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class ProfileDashboard implements OnInit {
    profile: UserProfile | null = null;
    profileForm: FormGroup;
    loading = true;
    editing = false;
    message = '';

    constructor(
        private profileService: ProfileService,
        private fb: FormBuilder
    ) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit() {
        this.loadProfile();
    }

    loadProfile() {
        this.loading = true;
        this.profileService.getProfile().subscribe({
            next: (data) => {
                this.profile = data;
                this.profileForm.patchValue({
                    name: data.name,
                    email: data.email
                });
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load profile', err);
                this.message = 'Error loading profile: ' + (err.message || 'Unknown server error');
                this.loading = false;
            }
        });
    }

    toggleEdit() {
        this.editing = !this.editing;
        this.message = '';
        if (!this.editing && this.profile) {
            // Revert changes if cancelled
            this.profileForm.patchValue({
                name: this.profile.name,
                email: this.profile.email
            });
        }
    }

    onSubmit() {
        if (this.profileForm.invalid) return;

        this.profileService.updateProfile(this.profileForm.value).subscribe({
            next: () => {
                this.message = 'Profile updated successfully!';
                this.editing = false;
                this.loadProfile(); // Reload to get updated data
            },
            error: (err) => {
                this.message = err.error || 'Failed to update profile.';
            }
        });
    }
}
