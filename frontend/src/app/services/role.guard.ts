import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const expectedRole = route.data['expectedRole'];
    const expectedRoles = route.data['expectedRoles']; // Support multiple roles
    const user = this.authService.getCurrentUser();

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if expectedRoles (array) is provided
    if (expectedRoles && Array.isArray(expectedRoles)) {
      if (expectedRoles.includes(user.role)) {
        return true;
      }
    }
    
    // Check if expectedRole (single) is provided
    if (expectedRole && user.role === expectedRole) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}