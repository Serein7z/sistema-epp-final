import { Pipe, PipeTransform } from '@angular/core';
import { EppItem } from '../../core/models/epp-item.model';

// Pipe impuro a propósito: necesita re-evaluar en cada tecleo del buscador,
// recorriendo dinámicamente las claves indicadas (no un solo campo fijo).
@Pipe({ name: 'buscar', standalone: true, pure: false })
export class BuscarPipe implements PipeTransform {
  transform(items: EppItem[], termino: string, claves: string[]): EppItem[] {
    if (!termino?.trim()) return items;
    const texto = termino.trim().toLowerCase();

    return items.filter(item =>
      claves.some(clave => String(item[clave] ?? '').toLowerCase().includes(texto))
    );
  }
}
