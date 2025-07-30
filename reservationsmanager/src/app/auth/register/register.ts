import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  userName = '';
  password = '';
  confirmPassword = '';
  emailAddress = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  register(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.cdr.detectChanges();
      return;
    }

    if (form.invalid) return;

    this.auth.register({
      userName: this.userName,
      password: this.password,
      emailAddress: this.emailAddress
    }).subscribe({
      next: res => {
        if (res.success) {
          this.successMessage = 'Registration successful! You can now log in.';
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = res.message || 'Registration failed.';
        }
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Server error during registration.';
        this.cdr.detectChanges();
      }
    });
  }
}
