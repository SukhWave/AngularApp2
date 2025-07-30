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
  styleUrls: ['./login.css']
})
export class Login {
  userName = '';
  password = '';
  errorMessage = '';
  lockoutTimer: any = null;
  remainingMinutes: number = 0;

  constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  login(): void {
    this.errorMessage = '';

    this.auth.login({ userName: this.userName, password: this.password }).subscribe({
      next: res => {
        if (res.success) {
          this.clearLockoutTimer();
          this.auth.setAuth(true);
          localStorage.setItem('username', this.userName);
          this.router.navigate(['/reservations']);
        } else {
          this.errorMessage = res.message || 'Login failed. Please try again.';
        }
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMessage = 'Server error during login. Please try again.';

        if (err.status === 403) {
          // Account is locked
          const msg = err.error?.error || 'Account locked. Please wait.';
          this.errorMessage = msg;

          const match = msg.match(/in (\d+) minute/);
          if (match) {
            this.remainingMinutes = parseInt(match[1], 10);
            this.startLockoutCountdown();
          }
        } else if (err.status === 401) {
          // Failed attempt but not locked yet
          const remaining = err.error?.remainingAttempts ?? null;
          if (remaining !== null && remaining > 0) {
            this.errorMessage = `Invalid username or password. You have ${remaining} attempt(s) remaining before lockout.`;
          } else {
            this.errorMessage = 'Invalid username or password.';
          }
        } else if (err.status === 404) {
          this.errorMessage = 'User not found.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  /** Starts countdown timer to show remaining lockout time */
  startLockoutCountdown() {
    this.clearLockoutTimer();

    this.lockoutTimer = setInterval(() => {
      if (this.remainingMinutes > 1) {
        this.remainingMinutes--;
        this.errorMessage = `Account locked. Try again in ${this.remainingMinutes} minute(s).`;
      } else {
        this.clearLockoutTimer();
        this.errorMessage = '';
      }
      this.cdr.detectChanges();
    }, 60000); // update every 1 minute
  }

  /** Clears any lockout countdown interval */
  clearLockoutTimer() {
    if (this.lockoutTimer) {
      clearInterval(this.lockoutTimer);
      this.lockoutTimer = null;
    }
  }
}
