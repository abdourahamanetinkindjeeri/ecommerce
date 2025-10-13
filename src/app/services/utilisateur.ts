import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const BASE_URL = 'http://localhost:5173/api/';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private currentUser: any = null;

  constructor(private http: HttpClient) {}

  /**
   * 🔐 Connexion utilisateur
   */
  login(credentials: { login: string; password: string }): Observable<any> {
    console.log(`login: ${credentials.login}, password: ${credentials.password}`);

    return this.http.post(`${BASE_URL}auth/login`, credentials, { withCredentials: true });
  }

  /**
   * 🧾 Inscription utilisateur
   */
  register(data: {
    name: string;
    email: string;
    password: string;
    telephone: string;
    adresse: string;
  }): Observable<any> {
    return this.http.post(`${BASE_URL}users`, data, { withCredentials: true });
  }

  /**
   * 👤 Récupérer l'utilisateur connecté
   */
  getMe(): Observable<any> {
    return this.http.get(`${BASE_URL}auth/me`, { withCredentials: true });
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  logout() {
    this.currentUser = null;
    // Clear cookies would be handled by backend call
  }
}
