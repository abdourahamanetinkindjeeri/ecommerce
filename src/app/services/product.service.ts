import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:5173/api/products'; // Change to backend port (adjust if different)
  private categoriesUrl = 'http://localhost:5173/api/categories';

  constructor(private http: HttpClient) {}

  getProducts(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  getProductsPaginated(page: number, limit: number, search?: string): Observable<any> {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get(url);
  }

  getProduct(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getCategories(search?: string): Observable<any> {
    const params = search ? `?search=${search}` : '';
    return this.http.get(`${this.categoriesUrl}${params}`);
  }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  approveProduct(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {}, { withCredentials: true });
  }

  renewProduct(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/renew`, {}, { withCredentials: true });
  }

  getProductsByStatus(status: string, page: number = 1, limit: number = 10, search?: string): Observable<any> {
    let url = `${this.apiUrl}/status/${status}?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.http.get(url);
  }

  getPendingProducts(): Observable<any> {
    return this.getProductsByStatus('EN_ATTENTE');
  }

  deleteExpiredProducts(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/expired`, { withCredentials: true });
  }

  createCategory(data: any): Observable<any> {
    return this.http.post(this.categoriesUrl, data, { withCredentials: true });
  }
}
