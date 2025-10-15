import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  private isLoggedIn = false;
  private currentUser: any = null;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    // For demo purposes, allow a dummy login
    if (email === 'admin@example.com' && password === 'password') {
      this.isLoggedIn = true;
      this.currentUser = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      };
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return of(this.currentUser);
    }

    return this.http.post(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(user => {
          this.isLoggedIn = true;
          this.currentUser = user;
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn || !!localStorage.getItem('user');
  }

  getCurrentUser(): any {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.isLoggedIn = true;
      return this.currentUser;
    }
    
    return null;
  }
}