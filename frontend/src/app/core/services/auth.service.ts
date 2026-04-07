import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /*
  =================================
  BASE API URL
  =================================
  Final URL becomes:
  https://hire-helper-infosys.onrender.com/api/auth
  */

  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  /*
  =================================
  REGISTER USER
  =================================
  POST /api/auth/register
  */

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /*
  =================================
  VERIFY OTP
  =================================
  POST /api/auth/verify-otp
  */

  verifyOtp(email_id: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, {
      email_id,
      otp
    });
  }

  /*
  =================================
  LOGIN USER
  =================================
  POST /api/auth/login
  */

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(

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

  /*
  =================================
  GET CURRENT USER
  =================================
  GET /api/users/me
  */

  getMe(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/users/me`);
  }

  /*
  =================================
  UPDATE PROFILE
  =================================
  PUT /api/users/me
  */

  updateProfile(formData: FormData): Observable<any> {

    return this.http.put(`${environment.apiUrl}/api/users/me`, formData).pipe(

      tap((res: any) => {

        if (res) {

          localStorage.setItem('user', JSON.stringify(res));

        }

      })

    );

  }

  /*
  =================================
  UPDATE SETTINGS
  =================================
  PUT /api/users/settings
  */

  updateSettings(settings: any): Observable<any> {

    return this.http.put(`${environment.apiUrl}/api/users/settings`, settings);

  }

  /*
  =================================
  LOGOUT
  =================================
  */

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

  }

  /*
  =================================
  GET TOKEN
  =================================
  */

  getToken(): string | null {

    return localStorage.getItem('token');

  }

  /*
  =================================
  CHECK LOGIN STATUS
  =================================
  */

  isLoggedIn(): boolean {

    const token = this.getToken();

    return !!token;

  }

}
