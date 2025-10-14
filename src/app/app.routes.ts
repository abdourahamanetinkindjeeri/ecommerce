import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { Home } from './home/home';
import { ProductDetailComponent } from './products/product-detail.component';
import { AddProductComponent } from './add-product/add-product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApproveProductsComponent } from './approve-products/approve-products.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home }, // page vitrine produits accessible sans connexion
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'add-product', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'approve-products', component: ApproveProductsComponent, canActivate: [AuthGuard] },
  { path: 'manage-categories', component: ManageCategoriesComponent, canActivate: [AuthGuard] },
  // 404
  { path: '**', redirectTo: '' },
];
