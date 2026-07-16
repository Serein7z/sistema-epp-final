import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EppItem } from '../models/epp-item.model';

// Un solo servicio HTTP para los 5 recursos: recibe el "path" (cascos, guantes...)
// y arma la URL. Evita repetir CascoService, GuanteService... 5 veces en el front,
// tal como el backend ya separa cada CRUD por controller.
@Injectable({ providedIn: 'root' })
export class EppService {
  constructor(private http: HttpClient) {}

  listar(path: string): Observable<EppItem[]> {
    return this.http.get<EppItem[]>(`${environment.apiUrl}/${path}`);
  }

  obtener(path: string, id: number): Observable<EppItem> {
    return this.http.get<EppItem>(`${environment.apiUrl}/${path}/${id}`);
  }

  crear(path: string, item: EppItem): Observable<EppItem> {
    return this.http.post<EppItem>(`${environment.apiUrl}/${path}`, item);
  }

  actualizar(path: string, id: number, item: EppItem): Observable<EppItem> {
    return this.http.put<EppItem>(`${environment.apiUrl}/${path}/${id}`, item);
  }

  eliminar(path: string, id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${path}/${id}`);
  }
}
