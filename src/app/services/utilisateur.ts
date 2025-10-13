import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const BASE_URL = 'http://localhost:5173/api/';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
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
}
