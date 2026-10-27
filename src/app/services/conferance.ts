import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Conferance } from '../models/conferance';

@Injectable({
  providedIn: 'root',
})
export class ConferanceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/conferances';

  getAll(): Observable<Conferance[]> {
    return this.http.get<Conferance[]>(this.apiUrl);
  }

  getById(id: number): Observable<Conferance> {
    return this.http.get<Conferance>(`${this.apiUrl}/${id}`);
  }

  addConferance(conf: Conferance): Observable<Conferance> {
    return this.http.post<Conferance>(this.apiUrl, conf);
  }

  updateConferance(id: number, conf: Conferance): Observable<Conferance> {
    return this.http.put<Conferance>(`${this.apiUrl}/${id}`, conf);
  }

  deleteConferance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
