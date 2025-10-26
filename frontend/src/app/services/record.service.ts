import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private apiUrl = '/api/records';  // Using relative path with proxy

  constructor(private http: HttpClient) { }

  getRecords(search?: string): Observable<any[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  createRecord(recordData: any): Observable<any> {
    const data = {
      ...recordData,
      studentId: recordData.studentId
    };
    return this.http.post<any>(this.apiUrl, data);
  }

  updateRecord(id: string, recordData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, recordData);
  }

  deleteRecord(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}