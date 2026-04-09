import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private requestTimeout = 15000; // 15 seconds

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      timeout(this.requestTimeout)
    );
  }

  verifyOtp(email_id: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, {
      email_id,
      otp
    }).pipe(
      timeout(this.requestTimeout)
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      timeout(this.requestTimeout),
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        }
      })
    );
  }

  getMe(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/me`).pipe(
      timeout(this.requestTimeout)
    );
  }

  updateProfile(formData: FormData): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/me`, formData).pipe(
      timeout(this.requestTimeout),
      tap((res: any) => {
        if (res) {
          localStorage.setItem('user', JSON.stringify(res));
        }
      })
    );
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/settings`, settings).pipe(
      timeout(this.requestTimeout)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
