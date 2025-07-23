import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class Auth {
  // 🔧 Update this to match your API path
  private baseUrl = 'http://localhost/reservationmanagerangular/api/auth/';
  isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  // 🔐 Login: send POST with username/password
  login(user: any) {
    return this.http.post<any>(`${this.baseUrl}login.php`, user);
  }

  // 📝 Register: send POST to register a new user
  register(user: any) {
    return this.http.post<any>(`${this.baseUrl}register.php`, user);
  }

  // 🚪 Logout: reset session and redirect
  logout() {
    this.http.get(`${this.baseUrl}logout.php`).subscribe(() => {
      this.isAuthenticated = false;
      localStorage.removeItem('auth');
      localStorage.removeItem('username');
      this.router.navigate(['/login']);
    });
  }

  // 🛡️ Check session from backend (optional usage)
  checkAuth() {
    return this.http.get<any>(`${this.baseUrl}checkAuth.php`);
  }

  // ✅ Set client-side auth flag
  setAuth(auth: boolean) {
    this.isAuthenticated = auth;
    localStorage.setItem('auth', auth ? 'true' : 'false');
  }

  // 🔍 Get auth status
  getAuth(): boolean {
    return localStorage.getItem('auth') === 'true';
  }
}

