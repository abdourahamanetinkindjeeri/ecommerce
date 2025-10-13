import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5173/api/products';

  constructor(private http: HttpClient) {}

  getProductsPaginated(page: number, limit: number ): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }
  
}
