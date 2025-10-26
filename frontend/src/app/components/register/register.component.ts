import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-wrapper">
      <div class="register-container">
        <mat-card class="register-card">
          <div class="logo-section">
            <mat-icon class="logo-icon">local_hospital</mat-icon>
            <h1 class="app-title">Create Account</h1>
            <p class="app-subtitle">Join our Health Center</p>
          </div>
          
          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name" type="text" placeholder="Enter your full name">
                <mat-icon matPrefix>person</mat-icon>
                <mat-error *ngIf="registerForm.get('name')?.hasError('required')">Name is required</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>I am a...</mat-label>
                <mat-select formControlName="role">
                  <mat-option value="student">
                    <mat-icon>school</mat-icon>
                    Student
                  </mat-option>
                  <mat-option value="doctor">
                    <mat-icon>medical_services</mat-icon>
                    Doctor
                  </mat-option>
                  <mat-option value="admin">
                    <mat-icon>admin_panel_settings</mat-icon>
                    Administrator
                  </mat-option>
                </mat-select>
                <mat-icon matPrefix>badge</mat-icon>
                <mat-error *ngIf="registerForm.get('role')?.hasError('required')">Please select your role</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email Address</mat-label>
                <input matInput formControlName="email" type="email" placeholder="Enter your email">
                <mat-icon matPrefix>email</mat-icon>
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
                <mat-hint *ngIf="registerForm.get('role')?.value === 'student'" class="student-hint">
                  Use @anurag.edu.in email for students
                </mat-hint>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput formControlName="password" type="password" placeholder="Create a password (min 6 characters)">
                <mat-icon matPrefix>lock</mat-icon>
                <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Password must be at least 6 characters</mat-error>
              </mat-form-field>
              
              <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || loading" class="full-width register-btn">
                <mat-spinner *ngIf="loading" diameter="20" class="button-spinner"></mat-spinner>
                <span *ngIf="!loading">Create Account</span>
              </button>
            </form>
            
            <div class="login-link">
              <p>Already have an account? <a routerLink="/login" class="link">Sign in here</a></p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .register-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      overflow-y: auto;
    }
    
    .register-container {
      width: 100%;
      max-width: 500px;
    }
    
    .register-card {
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
    
    .register-btn {
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
    
    .login-link {
      text-align: center;
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #eee;
    }
    
    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    
    .link:hover {
      text-decoration: underline;
    }
    
    .student-hint {
      color: #2196f3;
      font-size: 13px;
      font-weight: 500;
    }
    
    ::ng-deep .mat-select-panel mat-option {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.loading) {
      this.loading = true;
      const { name, email, password, role } = this.registerForm.value;
      
      // Client-side validation for student email
      if (role === 'student' && !email.endsWith('@anurag.edu.in')) {
        this.loading = false;
        this.snackBar.open('Students must use @anurag.edu.in email address', 'Close', {
          duration: 5000
        });
        return;
      }
      
      this.authService.register(name, email, password, role).subscribe({
        next: (user) => {
          this.loading = false;
          this.snackBar.open(`Welcome, ${user.name}! Your account has been created.`, 'Close', {
            duration: 3000
          });
          this.redirectBasedOnRole(user.role);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Registration failed: ' + (error.error?.message || 'Something went wrong'), 'Close', {
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