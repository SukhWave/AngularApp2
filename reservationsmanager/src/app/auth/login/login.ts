import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  userName = '';
  password = '';
  errorMessage = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.userName || !this.password) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

    this.auth.login({ userName: this.userName, password: this.password }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.auth.setAuth(true);
          localStorage.setItem('username', this.userName);
          this.router.navigate(['/reservations']);
        } else {
          this.errorMessage = res.message || 'Invalid credentials.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Server error during login.';
        this.cdr.detectChanges();
      }
    });
  }
}

