import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule) },
    { path: 'products', loadChildren: () => import('./features/product/product-module').then(m => m.ProductModule) },
    { path: 'order', loadChildren: () => import('./features/order/order-module').then(m => m.OrderModule) },
    { path: 'profile', loadChildren: () => import('./features/profile/profile-module').then(m => m.ProfileModule) },
    { path: 'retailer', loadChildren: () => import('./features/retailer/retailer-module').then(m => m.RetailerModule) },
    { path: 'admin', loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule) },
    { path: '', redirectTo: 'products', pathMatch: 'full' }
];
