// =============================================================
// src/app/core/services/auth.service.ts
// Handles login, logout, token storage, JWT decode, and guards.
// =============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { LoginPayload, LoginResponse, AuthUser, JwtPayload } from '../models';

const TOKEN_KEY   = 'auth_token';
const USER_KEY    = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  // ── Login ───────────────────────────────────────────────
  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload).pipe(
      tap((res) => {
        if (res.status && res.token) {
          localStorage.setItem(TOKEN_KEY, res.token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        }
      }),
    );
  }

  // ── Logout ──────────────────────────────────────────────
  logout(): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.LOGOUT, {}).pipe(
      tap(() => {
        this.clearSession();
        this.router.navigate(['/']);
      }),
    );
  }

  // ── Session Helpers ─────────────────────────────────────
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = this.decodeToken(token);
      // Check expiry (exp is in seconds, Date.now() is ms)
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  // ── JWT Decode (no library needed) ──────────────────────
  decodeToken(token: string): JwtPayload {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as JwtPayload;
  }

  // ── Refresh Token ───────────────────────────────────────
  refreshToken(): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.AUTH.REFRESH, {}).pipe(
      tap((res) => {
        if (res.status && res.token) {
          localStorage.setItem(TOKEN_KEY, res.token);
        }
      }),
    );
  }
}
