import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-wrapper">
      <div class="login-container">
        <mat-card class="login-card">
          <div class="logo-section">
            <mat-icon class="logo-icon">local_hospital</mat-icon>
            <h1 class="app-title">Health Center</h1>
            <p class="app-subtitle">Management System</p>
          </div>
          
          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email Address</mat-label>
                <input matInput formControlName="email" type="email" placeholder="Enter your email" autocomplete="email">
                <mat-icon matPrefix>email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput formControlName="password" type="password" placeholder="Enter your password" autocomplete="current-password">
                <mat-icon matPrefix>lock</mat-icon>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
              </mat-form-field>
              
              <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || loading" class="full-width login-btn">
                <mat-spinner *ngIf="loading" diameter="20" class="button-spinner"></mat-spinner>
                <span *ngIf="!loading">Sign In</span>
              </button>
            </form>
            
            <div class="divider">
              <span>OR</span>
            </div>
            
            <button mat-stroked-button color="primary" routerLink="/register" class="full-width register-btn">
              <mat-icon>person_add</mat-icon>
              Create New Account
            </button>
            
            <div class="demo-credentials">
              <p class="demo-title"><mat-icon>info</mat-icon> Demo Credentials:</p>
              <p><strong>Admin:</strong> admin@hospital.com / admin123</p>
              <p><strong>Doctor:</strong> sarah.johnson@hospital.com / doctor123</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      overflow-y: auto;
    }
    
    .login-container {
      width: 100%;
      max-width: 450px;
    }
    
    .login-card {
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .logo-section {
      text-align: center;
      padding: 30px 20px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .logo-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 10px;
    }
    
    .app-title {
      font-size: 28px;
      font-weight: 600;
      margin: 0;
    }
    
    .app-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 5px 0 0;
    }
    
    mat-card-content {
      padding: 30px !important;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .login-btn {
      height: 50px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 10px;
      position: relative;
    }
    
    .button-spinner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    
    .divider {
      text-align: center;
      margin: 25px 0;
      position: relative;
    }
    
    .divider:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #ddd;
    }
    
    .divider span {
      background: white;
      padding: 0 15px;
      position: relative;
      color: #999;
      font-size: 14px;
    }
    
    .register-btn {
      height: 48px;
      font-size: 15px;
    }
    
    .demo-credentials {
      margin-top: 25px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      font-size: 13px;
    }
    
    .demo-title {
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 10px;
    }
    
    .demo-title mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .demo-credentials p {
      margin: 5px 0;
      color: #666;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (user) => {
          this.loading = false;
          this.snackBar.open(`Welcome back, ${user.name}!`, 'Close', {
            duration: 3000
          });
          this.redirectBasedOnRole(user.role);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Login failed: ' + (error.error?.message || 'Invalid credentials'), 'Close', {
            duration: 5000
          });
        }
      });
    }
  }

  redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'doctor':
        this.router.navigate(['/doctor/dashboard']);
        break;
      case 'student':
        this.router.navigate(['/student/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }
}