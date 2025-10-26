import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  template: `
    <div *ngIf="isLoggedIn">
      <mat-toolbar color="primary" class="main-toolbar">
        <mat-icon class="app-icon">local_hospital</mat-icon>
        <span class="title">Health Center</span>
        <span class="spacer"></span>
        <div class="user-section">
          <mat-icon>account_circle</mat-icon>
          <span class="user-info">{{userName}}</span>
          <mat-chip class="role-chip">{{userRole}}</mat-chip>
        </div>
        <button mat-icon-button [matMenuTriggerFor]="menu" class="menu-button">
          <mat-icon>menu</mat-icon>
        </button>
        <mat-menu #menu="matMenu" class="custom-menu" xPosition="before">
          <button mat-menu-item routerLink="/dashboard" class="menu-item">
            <mat-icon class="menu-icon">dashboard</mat-icon>
            <span class="menu-text">Dashboard</span>
          </button>
          
          <!-- Admin Menu Items -->
          <div *ngIf="userRole === 'admin'">
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/appointments" class="menu-item">
              <mat-icon class="menu-icon">calendar_today</mat-icon>
              <span class="menu-text">All Appointments</span>
            </button>
            <button mat-menu-item routerLink="/records" class="menu-item">
              <mat-icon class="menu-icon">description</mat-icon>
              <span class="menu-text">All Records</span>
            </button>
            <button mat-menu-item routerLink="/doctors" class="menu-item">
              <mat-icon class="menu-icon">people</mat-icon>
              <span class="menu-text">Manage Doctors</span>
            </button>
            <button mat-menu-item routerLink="/students" class="menu-item">
              <mat-icon class="menu-icon">school</mat-icon>
              <span class="menu-text">View Students</span>
            </button>
          </div>
          
          <!-- Doctor Menu Items -->
          <div *ngIf="userRole === 'doctor'">
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/appointments" class="menu-item">
              <mat-icon class="menu-icon">calendar_today</mat-icon>
              <span class="menu-text">My Appointments</span>
            </button>
            <button mat-menu-item routerLink="/records" class="menu-item">
              <mat-icon class="menu-icon">description</mat-icon>
              <span class="menu-text">Medical Records</span>
            </button>
            <button mat-menu-item routerLink="/students" class="menu-item">
              <mat-icon class="menu-icon">school</mat-icon>
              <span class="menu-text">View Students</span>
            </button>
          </div>
          
          <!-- Student Menu Items -->
          <div *ngIf="userRole === 'student'">
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/appointments" class="menu-item">
              <mat-icon class="menu-icon">calendar_today</mat-icon>
              <span class="menu-text">My Appointments</span>
            </button>
            <button mat-menu-item routerLink="/records" class="menu-item">
              <mat-icon class="menu-icon">description</mat-icon>
              <span class="menu-text">My Records</span>
            </button>
          </div>
          
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()" class="menu-item logout-item">
            <mat-icon class="menu-icon">exit_to_app</mat-icon>
            <span class="menu-text">Logout</span>
          </button>
        </mat-menu>
      </mat-toolbar>
    </div>
    
    <div class="content">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      height: 70px;
      padding: 0 24px;
    }
    
    .app-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-right: 12px;
    }
    
    .title {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-section {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-right: 15px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }
    
    .user-info {
      font-size: 15px;
      font-weight: 500;
    }
    
    .role-chip {
      height: 24px;
      font-size: 12px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
      text-transform: uppercase;
    }
    
    .menu-button {
      width: 48px;
      height: 48px;
    }
    
    .menu-button mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    
    ::ng-deep .custom-menu {
      min-width: 280px !important;
    }
    
    ::ng-deep .custom-menu .mat-menu-content {
      padding: 8px 0 !important;
    }
    
    .menu-item {
      height: 56px !important;
      padding: 0 24px !important;
      font-size: 15px !important;
    }
    
    .menu-icon {
      margin-right: 16px !important;
      font-size: 24px !important;
      width: 24px !important;
      height: 24px !important;
      color: #667eea !important;
    }
    
    .menu-text {
      font-size: 15px;
      font-weight: 500;
    }
    
    .logout-item .menu-icon {
      color: #f44336 !important;
    }
    
    .logout-item:hover {
      background-color: rgba(244, 67, 54, 0.1) !important;
    }
    
    .content {
      min-height: calc(100vh - 70px);
      background-color: #f5f5f5;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userRole = '';
  userName = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Listen to route changes to update auth status
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuthStatus();
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.userRole = user.role;
      this.userName = user.name;
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userRole = '';
    this.userName = '';
    this.router.navigate(['/login']);
  }
}