import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cart } from './cart/cart';
import { Checkout } from './checkout/checkout';

import { WishlistComponent } from './wishlist/wishlist';
import { CompareComponent } from './compare/compare';

const routes: Routes = [
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'compare', component: CompareComponent },
  { path: '', redirectTo: 'cart', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
