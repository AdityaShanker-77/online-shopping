import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
    uploadMessage = '';

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    constructor(
        private profileService: ProfileService,
        private fb: FormBuilder
    ) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            address: ['']
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
                    name: data.name || data.fullName,
                    email: data.email,
                    phone: data.phone || '',
                    address: data.address || ''
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
                this.message = 'Profile updated successfully!';
                this.editing = false;
                this.loadProfile();
            },
            error: (err) => {
                this.message = err.error || 'Failed to update profile.';
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
            this.uploadMessage = 'Error: File must not exceed 2MB';
            return;
        }

        if (!file.type.startsWith('image/')) {
            this.uploadMessage = 'Error: Please select an image file';
            return;
        }

        this.uploadMessage = 'Uploading...';
        this.profileService.uploadProfilePicture(file).subscribe({
            next: (res) => {
                this.uploadMessage = 'Profile picture updated!';
                if (this.profile) {
                    this.profile.profilePictureUrl = res.profilePictureUrl;
                }
                setTimeout(() => this.uploadMessage = '', 3000);
            },
            error: (err) => {
                this.uploadMessage = 'Error: ' + (err?.error?.message || 'Upload failed');
            }
        });

        // Reset the input so the same file can be re-selected
        input.value = '';
    }
}
