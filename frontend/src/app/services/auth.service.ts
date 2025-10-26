import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/users';  // Using relative path with proxy
  private currentUser: any = null;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map((user: any) => {
          this.currentUser = user;
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  register(name: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password, role })
      .pipe(
        map((user: any) => {
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
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): any {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
      return this.currentUser;
    }
    
    return null;
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    return user ? user.token : null;
  }

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctors`);
  }

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students`);
  }
}