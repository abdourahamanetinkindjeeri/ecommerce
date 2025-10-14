import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UtilisateurService } from '../services/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private utilisateurService: UtilisateurService, private router: Router) {}

  canActivate(): boolean {
    const currentUser = this.utilisateurService.getCurrentUser();
    if (currentUser) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
