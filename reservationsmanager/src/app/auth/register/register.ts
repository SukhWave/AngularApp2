import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  userName = '';
  password = '';
  emailAddress = '';
  errorMessage = '';
  successMessage = '';

  constructor(private auth: Auth, private router: Router) {}

  register() {
    const trimmedUsername = this.userName.trim();
    const trimmedPassword = this.password.trim();
    const trimmedEmail = this.emailAddress.trim();

    if (!trimmedUsername || !trimmedPassword || !trimmedEmail) {
      this.errorMessage = 'All fields are required.';
      this.successMessage = '';
      return;
    }

    this.auth.register({
      userName: trimmedUsername,
      password: trimmedPassword,
      emailAddress: trimmedEmail
    }).subscribe({
      next: res => {
        if (res.success) {
          this.successMessage = 'Registration successful. Please log in.';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.errorMessage = res.message;
          this.successMessage = '';
        }
      },
      error: () => {
        this.errorMessage = 'Server error during registration.';
        this.successMessage = '';
      }
    });
  }
}
