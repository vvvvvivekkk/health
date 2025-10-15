import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:3000/api/appointments';

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAppointment(appointmentData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, appointmentData);
  }

  updateAppointment(id: string, appointmentData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, appointmentData);
  }

  deleteAppointment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}