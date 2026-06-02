// =============================================================
// src/app/pages/auth/auth.component.ts  — UPDATED
// Replaces the mock login with real API call.
// =============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  showPassword = false;
  isLoading    = false;

  credentials = { email: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    // If already logged in, skip to dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.toastr.error('Please enter email and password');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status) {
          this.toastr.success(`Welcome, ${res.user.name}!`);
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(res.message || 'Login failed');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message || 'Invalid email or password';
        this.toastr.error(msg);
      },
    });
  }
}
