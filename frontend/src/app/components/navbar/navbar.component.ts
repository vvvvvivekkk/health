import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar color="primary">
      <span>Health Center Management</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.isAuthenticated()">
        <button mat-button routerLink="/dashboard">Dashboard</button>
        <button mat-button routerLink="/appointments">Appointments</button>
        <button mat-button routerLink="/records">Medical Records</button>
        <button mat-button (click)="logout()">Logout</button>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}