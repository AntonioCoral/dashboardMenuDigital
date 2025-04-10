import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://codeconnectivity.com/apilinea/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveCompanyId(companyId: number): void {
    localStorage.setItem('companyId', companyId.toString());
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCompanyId(): number | null {
    const companyId = localStorage.getItem('companyId');
    return companyId ? parseInt(companyId, 10) : null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('companyId');
  }
}
