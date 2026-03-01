import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetailerDashboard } from './dashboard/dashboard';

import { RetailerProductForm } from './product-form/product-form';

const routes: Routes = [
  { path: 'dashboard', component: RetailerDashboard },
  { path: 'product/new', component: RetailerProductForm },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailerRoutingModule { }
