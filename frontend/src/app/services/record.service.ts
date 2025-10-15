import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private apiUrl = 'http://localhost:3000/api/records';

  constructor(private http: HttpClient) { }

  getRecords(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createRecord(recordData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, recordData);
  }

  updateRecord(id: string, recordData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, recordData);
  }

  deleteRecord(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}