import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:5200/api/menu'; // Update with your API base URL

  constructor(private http: HttpClient) { }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.baseUrl}`);
  }

  getMenuItem(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.baseUrl}/${id}`);
  }

  updateMenuItem(id: number, menuItem: MenuItem): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, menuItem);
  }

  deleteMenuItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
