import { Injectable } from '@angular/core';
import { Notify } from 'notiflix';

Notify.init({
  width: '340px',
  position: 'right-top',
  distance: '20px',
  opacity: 1,
  borderRadius: '14px',
  timeout: 3500,
  clickToClose: true,
  fontFamily: "'Inter', sans-serif",
  fontSize: '13.5px',
  cssAnimationStyle: 'from-right',
  cssAnimationDuration: 300,
  useIcon: true,
  success: {
    background: '#1c2531',
    textColor: '#eaf1fb',
    childClassName: 'checksafe-toast-exito',
    notiflixIconColor: '#10b981',
    backOverlayColor: 'rgba(16, 185, 129, 0.15)',
  },
  failure: {
    background: '#1c2531',
    textColor: '#eaf1fb',
    childClassName: 'checksafe-toast-error',
    notiflixIconColor: '#f2637a',
    backOverlayColor: 'rgba(242, 99, 122, 0.15)',
  },
  info: {
    background: '#1c2531',
    textColor: '#eaf1fb',
    childClassName: 'checksafe-toast-info',
    notiflixIconColor: '#10b981',
    backOverlayColor: 'rgba(16, 185, 129, 0.15)',
  },
});

@Injectable({ providedIn: 'root' })
export class ToastService {
  exito(mensaje: string): void {
    Notify.success(mensaje);
  }

  error(mensaje: string): void {
    Notify.failure(mensaje);
  }

  info(mensaje: string): void {
    Notify.info(mensaje);
  }
}
