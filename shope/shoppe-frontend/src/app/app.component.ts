import { Component, effect } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models/user.model';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterModule, CommonModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'shoppe-frontend';
    currentUser: User | null = null;
    isAdmin = false;
    isRetailer = false;
    isCustomer = false;

    constructor(private authService: AuthService) {
        effect(() => {
            this.currentUser = this.authService.currentUser();
            if (this.currentUser) {
                this.isAdmin = this.currentUser.roles.includes('ROLE_ADMIN');
                this.isRetailer = this.currentUser.roles.includes('ROLE_RETAILER') || this.currentUser.roles.includes('RETAILER');
                this.isCustomer = this.currentUser.roles.includes('ROLE_USER') || this.currentUser.roles.includes('USER');
            } else {
                this.isAdmin = false;
                this.isRetailer = false;
                this.isCustomer = false;
            }
        });
    }

    logout() {
        this.authService.logout();
        window.location.href = '/auth/login'; // Redirects and forces a page refresh
    }
}
