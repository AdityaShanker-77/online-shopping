import { Component, effect, DestroyRef, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models/user.model';
import { LucideAngularModule, ShoppingCart, Heart } from 'lucide-angular';
import { ToastComponent } from './shared/components/toast/toast.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterModule, CommonModule, LucideAngularModule, ToastComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'shoppe-frontend';
    currentUser: User | null = null;
    isAdmin = false;
    isRetailer = false;
    isCustomer = false;
    isLoading = false;

    private destroyRef = inject(DestroyRef);

    constructor(private authService: AuthService, private router: Router) {
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

        // Setup route navigation loader
        this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                this.isLoading = true;
            } else if (
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError
            ) {
                // Add a small delay for smoother visuals before hiding the loader
                setTimeout(() => {
                    this.isLoading = false;
                }, 300);
            }
        });
    }

    logout() {
        this.authService.logout();
        window.location.href = '/auth/login'; // Redirects and forces a page refresh
    }
}
