import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalizar', standalone: true })
export class CapitalizarPipe implements PipeTransform {
  transform(valor: string | number | undefined): string {
    if (valor === undefined || valor === null) return '';
    const texto = String(valor).trim();
    if (!texto) return '';
    return texto
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ');
  }
}
