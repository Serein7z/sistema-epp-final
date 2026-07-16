import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios`);
  }

  cambiarPassword(id: number, nuevaPassword: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/usuarios/${id}/password`, { nuevaPassword });
  }
}
