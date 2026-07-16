import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface SesionUsuario {
  username: string;
  rol: 'ADMIN' | 'USER';
}

const TOKEN_KEY = 'epp_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // BehaviorSubject: cualquier componente (sidebar, dashboard, guards) se suscribe
  // y reacciona al instante si el usuario inicia o cierra sesión, sin recargar la página.
  private sesion$ = new BehaviorSubject<SesionUsuario | null>(this.leerSesionDelToken());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { username, password };
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, body).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        this.sesion$.next(this.leerSesionDelToken());
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.sesion$.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  get sesionActual$(): Observable<SesionUsuario | null> {
    return this.sesion$.asObservable();
  }

  get sesionActual(): SesionUsuario | null {
    return this.sesion$.value;
  }

  esAdmin(): boolean {
    return this.sesion$.value?.rol === 'ADMIN';
  }

  // El token JWT trae el claim "roles" como texto plano, ej: "[ROLE_ADMIN]"
  private leerSesionDelToken(): SesionUsuario | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiroEl = payload.exp * 1000;
      if (Date.now() >= expiroEl) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }

      const rolesTexto: string = payload.roles ?? '';
      const rol = rolesTexto.includes('ADMIN') ? 'ADMIN' : 'USER';

      return { username: payload.sub, rol };
    } catch {
      return null;
    }
  }
}
