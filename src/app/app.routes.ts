import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home }, // page vitrine produits accessible sans connexion
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // 404
  { path: '**', redirectTo: '' }
];
