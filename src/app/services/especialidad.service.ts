import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private apiUrl = 'https://localhost:7125/api/Especialidad'; // URL de tu API

  constructor(private http: HttpClient) {}

  getEspecialidad(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  addEspecialidad(especialidad: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, especialidad);
  }

  updateEspecialidad(id: number, especialidad: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, especialidad);
  }

  deleteEspecialidad(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }  
  
}
